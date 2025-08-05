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

    // 백엔드 빌드 파일이 있는지 확인
    if (!fs.existsSync(backendPath)) {
      reject(new Error(`Backend build not found at: ${backendPath}`));
      return;
    }

    // 백엔드 서버 시작
    const nodePath = process.execPath; // 현재 실행 중인 Node.js 경로 사용
    const backendDir = path.dirname(backendPath);
    const nodeModulesPath = path.join(path.dirname(backendDir), "node_modules");

    console.log(`Starting backend server with path: ${backendPath}`);
    console.log(`Backend directory: ${backendDir}`);
    console.log(`Backend directory: ${backendDir}`);

    backendProcess = spawn(nodePath, [backendPath], {
      stdio: "pipe",
      cwd: backendDir, // 백엔드 디렉토리를 작업 디렉토리로 설정
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: "7777",
        ELECTRON_IS_DEV: "false",
      },
    });

    backendProcess.stdout?.on("data", (data) => {
      console.log(`Backend: ${data}`);
      if (data.toString().includes("Application is running on")) {
        resolve();
      }
    });

    backendProcess.stderr?.on("data", (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on("error", (error) => {
      console.error("Failed to start backend:", error);
      reject(error);
    });

    backendProcess.on("exit", (code) => {
      console.log(`Backend process exited with code ${code}`);
    });

    // 10초 타임아웃
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        resolve(); // 타임아웃이지만 백엔드가 실행 중이면 성공으로 처리
      } else {
        reject(new Error("Backend startup timeout"));
      }
    }, 10000);
  });
}

// 백엔드 서버 중지
function stopBackendServer() {
  if (backendProcess) {
    try {
      backendProcess.kill("SIGTERM");
      // 3초 후에도 종료되지 않으면 강제 종료
      setTimeout(() => {
        if (backendProcess && !backendProcess.killed) {
          backendProcess.kill("SIGKILL");
        }
      }, 3000);
      backendProcess = null;
    } catch (error) {
      console.error("Error stopping backend server:", error);
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // dev 서버에서 열기 (vite dev)
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // 개발 모드가 아닐 때만 DevTools 숨기기
  // 개발 모드가 아닐 때 DevTools를 비활성화
  if (!process.env.VITE_DEV_SERVER_URL) {
    mainWindow?.webContents.on("devtools-opened", () => {
      mainWindow?.webContents.closeDevTools();
    });
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
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 두 번째 인스턴스 실행 시 기존 창 포커스
app.on("second-instance", () => {
  if (mainWindow) {
    // 기존 창이 최소화되어 있으면 복원
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    // 기존 창을 앞으로 가져오기
    mainWindow.focus();
    // macOS에서 Dock 아이콘 클릭 시 창 표시
    mainWindow.show();
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
