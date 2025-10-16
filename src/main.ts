import { app, BrowserWindow, session } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup";
import path from "path";
import { fileURLToPath } from "url";
// React Developer Tools disabled to prevent extension warnings and errors
// If you need React DevTools, you can install it manually in Chrome/Edge
// and use the remote debugging port: chrome://inspect

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,

      preload: preload,
    },
    titleBarStyle: "hidden",
  });
  registerListeners(mainWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

async function installExtensions() {
  // Extensions completely disabled to prevent service worker and database errors
  // React DevTools can still be used via Chrome DevTools or remote debugging
  console.log("React DevTools: Use chrome://inspect for debugging");
}

app.whenReady().then(async () => {
  // Suppress Electron deprecation warnings in development
  if (inDevelopment) {
    process.removeAllListeners("warning");
  }

  await createWindow();
  await installExtensions();
});

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends
