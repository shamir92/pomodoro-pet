const { app, BrowserWindow, Tray, Menu, ipcMain, screen } = require("electron");
const path = require("path");

let win;
let tray;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 220,
    height: 280,
    x: width - 260,
    y: height - 340,
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
  const iconPath = path.join(__dirname, "icon.png");
  try {
    tray = new Tray(iconPath);
  } catch {
    // If icon missing, use a blank one — tray optional on Mac
    return;
  }
  const menu = Menu.buildFromTemplate([
    { label: "Show Pet", click: () => win && win.show() },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("Pomodoro Pet");
  tray.setContextMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", () => app.quit());
