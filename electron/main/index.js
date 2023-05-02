const { app, BrowserWindow } = require("electron");
const { ENV } = require("../../config/project");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, "../preload/index.js"), // 需要引用js文件
    },
  });
  if (ENV.isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadURL(
      `file://${path.join(__dirname, "../../", "dist", "index.html")}`
    );
  }
};

app.whenReady().then(() => {
  createWindow();

  //  macOS 应用在无窗口可用时激活应用会打开新的窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  //  非 macOS 应用，关闭所有窗口时会退出应用
  if (process.platform !== "darwin") app.quit();
});
