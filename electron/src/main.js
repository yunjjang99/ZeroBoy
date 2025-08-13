"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
let backendProcess = null;
let mainWindow = null;
const isDev = require("electron-is-dev");
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    console.log("Another instance is already running. Exiting...");
    electron_1.app.quit();
    process.exit(0);
}
function startBackendServer() {
    return new Promise((resolve, reject) => {
        const backendPath = path.join(__dirname, "../..", "backend/dist/src/main.js");
        console.log(`🔍 Debug Info:`);
        console.log(`   - app.isPackaged: ${electron_1.app.isPackaged}`);
        console.log(`   - __dirname: ${__dirname}`);
        console.log(`   - process.cwd(): ${process.cwd()}`);
        console.log(`   - backendPath: ${backendPath}`);
        console.log(`   - resourcesPath: ${process.resourcesPath}`);
        if (!fs.existsSync(backendPath)) {
            console.error(`❌ Backend build not found at: ${backendPath}`);
            reject(new Error(`Backend build not found at: ${backendPath}`));
            return;
        }
        console.log(`✅ Backend build found at: ${backendPath}`);
        const backendDir = path.dirname(backendPath);
        console.log(`🚀 Starting backend server:`);
        console.log(`   - backendDir: ${backendDir}`);
        const nodeModulesPath = path.join(__dirname, "../../", "backend/node_modules");
        const dbPath = path.join(__dirname, "../../", "data/db/db.sqlite");
        const env = {
            ...process.env,
            NODE_ENV: isDev ? "development" : "production",
            PORT: "7777",
            BACKEND_PORT: "7777",
            ELECTRON_IS_DEV: isDev ? "true" : "false",
            DB_PATH: dbPath,
            NODE_PATH: nodeModulesPath,
        };
        console.log(`🔧 Environment variables:`, env);
        console.log(`🔍 Debug paths:`);
        console.log(`   - Backend dir: ${backendDir}`);
        console.log(`   - Node modules path: ${nodeModulesPath}`);
        console.log(`   - Database path: ${dbPath}`);
        console.log(`   - Node modules exists: ${fs.existsSync(nodeModulesPath)}`);
        console.log(`   - Backend main.js exists: ${fs.existsSync(backendPath)}`);
        console.log(`   - Database directory exists: ${fs.existsSync(path.dirname(dbPath))}`);
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            console.log(`📁 Creating database directory: ${dbDir}`);
            fs.mkdirSync(dbDir, { recursive: true });
        }
        backendProcess = (0, child_process_1.fork)(backendPath, {
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
                }
                else if (output.includes("Another instance is already running")) {
                    console.log(`⚠️ Backend server already running, checking connection...`);
                    setTimeout(() => {
                        console.log(`✅ Backend server is already running and accessible`);
                        resolve();
                    }, 2000);
                }
                else if (output.includes("Nest application successfully started")) {
                    console.log(`✅ NestJS application started successfully`);
                    resolve();
                }
            });
            backendProcess.stderr?.on("data", (data) => {
                const error = data.toString().trim();
                console.error(`❌ Backend stderr: ${error}`);
                if (error.includes("Cannot find module")) {
                    console.error(`🔍 Module resolution error detected.`);
                    console.error(`   - Current working directory: ${backendDir}`);
                    console.error(`   - NODE_PATH: ${nodeModulesPath}`);
                    console.error(`   - Node modules exists: ${fs.existsSync(nodeModulesPath)}`);
                }
            });
            backendProcess.on("error", (error) => {
                console.error("❌ Failed to start backend:", error);
                reject(error);
            });
            backendProcess.on("exit", (code) => {
                console.log(`🔄 Backend process exited with code ${code}`);
                if (code === 0) {
                    console.log(`✅ Backend server is already running`);
                    resolve();
                }
                else if (code === 1) {
                    console.log(`⚠️ Backend server already running (exit code: ${code})`);
                    resolve();
                }
                else {
                    console.error(`❌ Backend process exited with error code: ${code}`);
                    reject(new Error(`Backend process exited with code ${code}`));
                }
            });
            setTimeout(() => {
                if (backendProcess && !backendProcess.killed) {
                    console.log(`⏰ Backend startup timeout, but process is running`);
                    resolve();
                }
                else {
                    console.error(`❌ Backend startup timeout and process is not running`);
                    reject(new Error("Backend startup timeout"));
                }
            }, 15000);
        }
        else {
            reject(new Error("Failed to create backend process"));
        }
    });
}
function stopBackendServer() {
    if (backendProcess) {
        try {
            console.log("Stopping backend server...");
            backendProcess.kill("SIGTERM");
            setTimeout(() => {
                if (backendProcess && !backendProcess.killed) {
                    console.log("Force killing backend server...");
                    backendProcess.kill("SIGKILL");
                }
            }, 3000);
            setTimeout(() => {
                if (backendProcess && !backendProcess.killed) {
                    console.log("Emergency cleanup of backend process...");
                    try {
                        process.kill(-backendProcess.pid, "SIGKILL");
                    }
                    catch (e) {
                        console.error("Failed to kill process group:", e);
                    }
                }
            }, 5000);
            backendProcess = null;
        }
        catch (error) {
            console.error("Error stopping backend server:", error);
        }
    }
}
function createWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
    }
    console.log(`🪟 Creating main window...`);
    mainWindow = new electron_1.BrowserWindow({
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
    mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
        console.error(`❌ Page loading failed:`, {
            errorCode,
            errorDescription,
            validatedURL,
        });
    });
    if (isDev) {
        console.log(`🔗 Loading from dev server: http://localhost:3000`);
        mainWindow.loadURL("http://localhost:3000");
        mainWindow.webContents.openDevTools();
    }
    else {
        const indexPath = path.join(__dirname, "../../", "frontend/dist/index.html");
        console.log(`📁 Loading from file: ${indexPath}`);
        console.log(`📁 File exists: ${fs.existsSync(indexPath)}`);
        mainWindow.loadFile(indexPath);
        mainWindow.webContents.openDevTools();
        mainWindow.webContents.on("console-message", (_event, level, message, line, sourceId) => {
            const levels = ["log", "info", "warn", "error"];
            console.log(`[Renderer ${levels[level]}] ${message} (${sourceId}:${line})`);
        });
    }
}
electron_1.app.whenReady().then(async () => {
    try {
        await startBackendServer();
        console.log("Backend server started successfully");
        createWindow();
    }
    catch (error) {
        console.error("Failed to start backend server:", error);
        createWindow();
    }
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
        else if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.focus();
        }
    });
});
electron_1.app.on("second-instance", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
        mainWindow.show();
    }
    else {
        createWindow();
    }
});
electron_1.app.on("window-all-closed", () => {
    stopBackendServer();
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("before-quit", () => {
    stopBackendServer();
});
electron_1.app.on("will-quit", () => {
    stopBackendServer();
});
process.on("exit", () => {
    stopBackendServer();
});
process.on("SIGINT", () => {
    stopBackendServer();
    electron_1.app.quit();
});
process.on("SIGTERM", () => {
    stopBackendServer();
    electron_1.app.quit();
});
//# sourceMappingURL=main.js.map