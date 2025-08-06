import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  versions: process.versions,
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel: string, args: unknown[]) => ipcRenderer.send(channel, args),
  on: (channel: string, func: (...args: unknown[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  once: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.once(channel, (_event, ...args) => func(...args));
  },
  invoke: (channel: string, args: unknown[]) =>
    ipcRenderer.invoke(channel, args),
});
