"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    platform: process.platform,
    versions: process.versions,
});
electron_1.contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, args) => electron_1.ipcRenderer.send(channel, args),
    on: (channel, func) => {
        const subscription = (_event, ...args) => func(...args);
        electron_1.ipcRenderer.on(channel, subscription);
        return () => {
            electron_1.ipcRenderer.removeListener(channel, subscription);
        };
    },
    once: (channel, func) => {
        electron_1.ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke: (channel, args) => electron_1.ipcRenderer.invoke(channel, args),
});
//# sourceMappingURL=preload.js.map