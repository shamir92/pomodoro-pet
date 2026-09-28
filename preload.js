const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("petAPI", {
  quit: () => ipcRenderer.invoke("quit"),
  minimize: () => ipcRenderer.invoke("minimize"),
});
