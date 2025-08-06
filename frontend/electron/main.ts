import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fork, ChildProcess } from "child_process";
import * as fs from "fs";

let backendProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;

// 단일 인스턴스 강제 설정
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  console.log("Another instance is already running. Exiting...");
  app.quit();
  process.exit(0);
}

// 백엔드 서버 시작
function startBackendServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
    const backendPath = isDev
      ? path.join(__dirname, "../../backend/dist/src/main.js")
      : path.join((process as any).resourcesPath, "backend/dist/src/main.js");

    console.log(`🔍 Debug Info:`);
    console.log(`   - isDev: ${isDev}`);
    console.log(`   - app.isPackaged: ${app.isPackaged}`);
    console.log(`   - backendPath: ${backendPath}`);
    console.log(`   - resourcesPath: ${(process as any).resourcesPath}`);

    if (!fs.existsSync(backendPath)) {
      console.error(`❌ Backend build not found at: ${backendPath}`);
      reject(new Error(`Backend build not found at: ${backendPath}`));
      return;
    }

    console.log(`✅ Backend build found at: ${backendPath}`);

    const backendDir = path.dirname(backendPath);

    console.log(`🚀 Starting backend server:`);
    console.log(`   - backendDir: ${backendDir}`);

    // 환경 변수 설정
    // 백엔드 node_modules 경로 설정
    const nodeModulesPath = isDev
      ? path.join(__dirname, "../../backend/node_modules")
      : path.join((process as any).resourcesPath, "backend/node_modules");

    const env = {
      ...process.env,
      NODE_ENV: "production",
      PORT: "7777",
      BACKEND_PORT: "7777",
      ELECTRON_IS_DEV: "false",
      DB_PATH: path.join(backendDir, "data/db.sqlite"),
      NODE_PATH: nodeModulesPath,
    };

    console.log(`🔧 Environment variables:`, env);
    console.log(`🔍 Debug paths:`);
    console.log(`   - Backend dir: ${backendDir}`);
    console.log(`   - Node modules path: ${nodeModulesPath}`);
    console.log(`   - Node modules exists: ${fs.existsSync(nodeModulesPath)}`);
    console.log(`   - Backend main.js exists: ${fs.existsSync(backendPath)}`);

    backendProcess = fork(backendPath, {
      cwd: backendDir,
      stdio: ["ignore", "pipe", "pipe", "ipc"],
      env: env,
      detached: false,
    });

    if (backendProcess) {
      backendProcess.stdout?.on("data", (data) => {
        const output = data.toString().trim();
        console.log(`📡 Backend stdout: ${output}`);

        if (output.includes("Application is running on")) {
          console.log(`✅ Backend server started successfully`);
          resolve();
        } else if (output.includes("Another instance is already running")) {
          console.log(
            `⚠️ Backend server already running, checking connection...`
          );
          // 백엔드가 이미 실행 중이면 연결 확인
          setTimeout(() => {
            console.log(`✅ Backend server is already running and accessible`);
            resolve();
          }, 2000);
        } else if (output.includes("Nest application successfully started")) {
          console.log(`✅ NestJS application started successfully`);
          resolve();
        }
      });

      backendProcess.stderr?.on("data", (data) => {
        const error = data.toString().trim();
        console.error(`❌ Backend stderr: ${error}`);

        // 모듈을 찾지 못하는 오류인 경우 더 자세한 정보 출력
        if (error.includes("Cannot find module")) {
          console.error(`🔍 Module resolution error detected.`);
          console.error(`   - Current working directory: ${backendDir}`);
          console.error(`   - NODE_PATH: ${nodeModulesPath}`);
          console.error(
            `   - Node modules exists: ${fs.existsSync(nodeModulesPath)}`
          );
        }
      });

      backendProcess.on("error", (error) => {
        console.error("❌ Failed to start backend:", error);
        reject(error);
      });

      backendProcess.on("exit", (code) => {
        console.log(`🔄 Backend process exited with code ${code}`);
        if (code === 0) {
          // 정상 종료인 경우 (이미 실행 중)
          console.log(`✅ Backend server is already running`);
          resolve();
        } else if (code === 1) {
          // 종료 코드 1은 보통 "Another instance is already running" 메시지와 함께 발생
          console.log(`⚠️ Backend server already running (exit code: ${code})`);
          resolve();
        } else {
          console.error(`❌ Backend process exited with error code: ${code}`);
          reject(new Error(`Backend process exited with code ${code}`));
        }
      });

      // 15초 타임아웃
      setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          console.log(`⏰ Backend startup timeout, but process is running`);
          resolve();
        } else {
          console.error(
            `❌ Backend startup timeout and process is not running`
          );
          reject(new Error("Backend startup timeout"));
        }
      }, 15000);
    } else {
      reject(new Error("Failed to create backend process"));
    }
  });
}

// 백엔드 서버 중지
function stopBackendServer() {
  if (backendProcess) {
    try {
      console.log("Stopping backend server...");

      // 먼저 SIGTERM으로 정상 종료 시도
      backendProcess.kill("SIGTERM");

      // 3초 후에도 종료되지 않으면 강제 종료
      setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          console.log("Force killing backend server...");
          backendProcess.kill("SIGKILL");
        }
      }, 3000);

      // 5초 후에도 프로세스가 남아있으면 추가 정리
      setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          console.log("Emergency cleanup of backend process...");
          try {
            process.kill(-backendProcess.pid!, "SIGKILL"); // 프로세스 그룹 전체 종료
          } catch (e) {
            console.error("Failed to kill process group:", e);
          }
        }
      }, 5000);

      backendProcess = null;
    } catch (error) {
      console.error("Error stopping backend server:", error);
    }
  }
}

function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }

  console.log(`🪟 Creating main window...`);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.on("closed", () => {
    console.log(`🪟 Main window closed`);
    mainWindow = null;
  });

  mainWindow.webContents.on("did-start-loading", () => {
    console.log(`📄 Page loading started`);
  });

  mainWindow.webContents.on("did-finish-load", () => {
    console.log(`✅ Page loading finished`);
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(`❌ Page loading failed:`, {
        errorCode,
        errorDescription,
        validatedURL,
      });
    }
  );

  // 개발 모드에서는 dev server에서 로드
  if (process.env.NODE_ENV === "development") {
    console.log(`🔗 Loading from dev server: http://localhost:3000`);
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    console.log(`📁 Loading from file: ${indexPath}`);
    console.log(`📁 File exists: ${fs.existsSync(indexPath)}`);
    mainWindow.loadFile(indexPath);
    mainWindow.webContents.openDevTools();

    // 프로덕션에서도 콘솔 로그를 터미널에 출력
    mainWindow.webContents.on(
      "console-message",
      (event, level, message, line, sourceId) => {
        const levels = ["log", "info", "warn", "error"];
        console.log(
          `[Renderer ${levels[level]}] ${message} (${sourceId}:${line})`
        );
      }
    );
  }
}

app.whenReady().then(async () => {
  try {
    // 백엔드 서버 시작
    await startBackendServer();
    console.log("Backend server started successfully");

    // 메인 윈도우 생성
    createWindow();
  } catch (error) {
    console.error("Failed to start backend server:", error);
    // 백엔드 시작 실패해도 앱은 계속 실행 (백엔드가 이미 실행 중일 수 있음)
    createWindow();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow && !mainWindow.isDestroyed()) {
      // 기존 창이 있으면 포커스
      mainWindow.focus();
    }
  });
});

app.on("second-instance", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    mainWindow.show();
  } else {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  stopBackendServer();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  stopBackendServer();
});

app.on("will-quit", () => {
  stopBackendServer();
});

process.on("exit", () => {
  stopBackendServer();
});

process.on("SIGINT", () => {
  stopBackendServer();
  app.quit();
});

process.on("SIGTERM", () => {
  stopBackendServer();
  app.quit();
});
