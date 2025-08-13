"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const utils_1 = require("@electron-toolkit/utils");
const icon_png_asset_1 = __importDefault(require("../../resources/icon.png?asset"));
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 900,
        height: 670,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon: icon_png_asset_1.default } : {}),
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "../preload/index.js"),
            sandbox: false,
        },
    });
    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
    });
    mainWindow.webContents.setWindowOpenHandler((details) => {
        electron_1.shell.openExternal(details.url);
        return { action: "deny" };
    });
    if (utils_1.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    }
    else {
        mainWindow.loadFile((0, path_1.join)(__dirname, "../renderer/index.html"));
    }
}
electron_1.app.whenReady().then(() => {
    utils_1.electronApp.setAppUserModelId("com.electron");
    electron_1.app.on("browser-window-created", (_, window) => {
        utils_1.optimizer.watchWindowShortcuts(window);
    });
    createWindow();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
//# sourceMappingURL=update.js.map