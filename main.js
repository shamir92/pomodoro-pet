const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require("electron");
const path = require("path");

let win;
let tray;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 240,
    height: 340,
    x: width - 280,
    y: height - 380,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
  win.setAlwaysOnTop(true, "screen-saver");
}

function createTray() {
  try {
    const iconPath = path.join(__dirname, "icon.png");
    tray = new Tray(iconPath);
    const menu = Menu.buildFromTemplate([
      { label: "Show Pet", click: () => win && win.show() },
      { label: "Quit", click: () => app.quit() },
    ]);
    tray.setToolTip("Pomodoro Pet");
    tray.setContextMenu(menu);
  } catch {
    // tray optional
  }
}

// IPC handlers
ipcMain.handle("quit", () => {
  app.quit();
});

ipcMain.handle("minimize", () => {
  if (win) win.hide();
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", () => app.quit());
