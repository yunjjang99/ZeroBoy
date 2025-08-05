import { app, BrowserWindow } from "electron";
import * as path from "path";
import { spawn, ChildProcess } from "child_process";
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
    // 개발 모드와 프로덕션 모드에서 다른 경로 사용
    const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
    const backendPath = isDev
      ? path.join(__dirname, "../../backend/dist/src/main.js")
      : path.join((process as any).resourcesPath, "backend/dist/src/main.js");

    console.log(`🔍 Debug Info:`);
    console.log(`   - isDev: ${isDev}`);
    console.log(`   - app.isPackaged: ${app.isPackaged}`);
    console.log(`   - backendPath: ${backendPath}`);
    console.log(`   - resourcesPath: ${(process as any).resourcesPath}`);

    // 백엔드 빌드 파일이 있는지 확인
    if (!fs.existsSync(backendPath)) {
      console.error(`❌ Backend build not found at: ${backendPath}`);
      reject(new Error(`Backend build not found at: ${backendPath}`));
      return;
    }

    console.log(`✅ Backend build found at: ${backendPath}`);

    // 백엔드 서버 시작
    const nodePath = process.platform === "win32" ? "node.exe" : "node"; // 시스템 Node.js 사용
    const backendDir = path.dirname(backendPath);
    const nodeModulesPath = path.join(path.dirname(backendDir), "node_modules");

    console.log(`🚀 Starting backend server:`);
    console.log(`   - nodePath: ${nodePath}`);
    console.log(`   - backendDir: ${backendDir}`);
    console.log(`   - nodeModulesPath: ${nodeModulesPath}`);

    // 환경 변수 설정
    const env = {
      ...process.env,
      NODE_ENV: "production",
      PORT: "7778", // 다른 포트 사용
      BACKEND_PORT: "7778", // 백엔드 포트도 설정
      ELECTRON_IS_DEV: "false",
      // SQLite 데이터베이스 경로 설정
      DB_PATH: path.join(backendDir, "data/db.sqlite"),
    };

    console.log(`🔧 Environment variables:`, env);

    backendProcess = spawn(nodePath, [backendPath], {
      stdio: "pipe",
      cwd: backendDir, // 백엔드 디렉토리를 작업 디렉토리로 설정
      env: env,
      // 프로세스 그룹 설정으로 자식 프로세스들이 함께 종료되도록 함
      detached: false,
    });

    backendProcess.stdout?.on("data", (data) => {
      console.log(`📡 Backend stdout: ${data}`);
      if (data.toString().includes("Application is running on")) {
        console.log(`✅ Backend server started successfully`);
        resolve();
      } else if (
        data.toString().includes("Another instance is already running")
      ) {
        console.log(
          `⚠️ Backend server already running, checking connection...`
        );
        // 백엔드가 이미 실행 중이면 연결 확인
        setTimeout(() => {
          console.log(`✅ Backend server is already running and accessible`);
          resolve();
        }, 2000);
      }
    });

    backendProcess.stderr?.on("data", (data) => {
      console.error(`❌ Backend stderr: ${data}`);
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
      } else {
        console.error(`❌ Backend process exited with error code: ${code}`);
        reject(new Error(`Backend process exited with code ${code}`));
      }
    });

    // 15초 타임아웃 (더 긴 시간으로 증가)
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        console.log(`⏰ Backend startup timeout, but process is running`);
        resolve(); // 타임아웃이지만 백엔드가 실행 중이면 성공으로 처리
      } else {
        console.error(`❌ Backend startup timeout and process is not running`);
        reject(new Error("Backend startup timeout"));
      }
    }, 15000);
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
  // 기존 윈도우가 있으면 정리
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

  // 윈도우가 닫힐 때 mainWindow 참조 정리
  mainWindow.on("closed", () => {
    console.log(`🪟 Main window closed`);
    mainWindow = null;
  });

  // 페이지 로딩 시작
  mainWindow.webContents.on("did-start-loading", () => {
    console.log(`📄 Page loading started`);
  });

  // 페이지 로딩 완료
  mainWindow.webContents.on("did-finish-load", () => {
    console.log(`✅ Page loading finished`);
  });

  // 페이지 로딩 실패
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

  // dev 서버에서 열기 (vite dev)
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log(
      `🔗 Loading from dev server: ${process.env.VITE_DEV_SERVER_URL}`
    );
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    console.log(`📁 Loading from file: ${indexPath}`);
    console.log(`📁 File exists: ${fs.existsSync(indexPath)}`);

    // HashRouter 사용으로 loadFile 사용
    mainWindow.loadFile(indexPath);

    // 프로덕션에서도 DevTools 열기 (디버깅용)
    mainWindow.webContents.openDevTools();
  }

  // 개발 모드가 아닐 때만 DevTools 숨기기 - 일시적으로 주석 처리
  // if (!process.env.VITE_DEV_SERVER_URL) {
  //   mainWindow?.webContents.on("devtools-opened", () => {
  //     if (mainWindow && !mainWindow.isDestroyed()) {
  //       mainWindow.webContents.closeDevTools();
  //     }
  //   });
  // }
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
    app.quit();
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

// 두 번째 인스턴스 실행 시 기존 창 포커스
app.on("second-instance", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    // 기존 창이 최소화되어 있으면 복원
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    // 기존 창을 앞으로 가져오기
    mainWindow.focus();
    // macOS에서 Dock 아이콘 클릭 시 창 표시
    mainWindow.show();
  } else {
    // mainWindow가 없거나 파괴된 경우 새로 생성
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

// 앱 종료 시 모든 프로세스 정리
app.on("will-quit", () => {
  stopBackendServer();
});

// 예기치 않은 종료 시에도 정리
process.on("exit", () => {
  stopBackendServer();
});

// 프로세스 종료 시 백엔드도 함께 종료
process.on("SIGINT", () => {
  stopBackendServer();
  app.quit();
});

process.on("SIGTERM", () => {
  stopBackendServer();
  app.quit();
});
