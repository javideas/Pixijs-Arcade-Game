import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Use these to get the correct directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    fullscreen: false,  // Start in normal mode
    show: false,
    icon: path.join(app.getAppPath() + '/Arcade_Logo.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js') // Use a preload script if needed
    }
  });
  mainWindow.loadFile(path.join(app.getAppPath() + '/dist-js/index.html'));
  mainWindow.once('ready-to-show', () => {
    // mainWindow.setFullScreen(true);
    mainWindow.maximize();
    mainWindow.reload();  // Force reload the page
    mainWindow.show();  // Show the window only when it's ready
  });

  // Register a global shortcut for Alt+F11
  globalShortcut.register('Alt+F11', () => {
    console.log('Alt+F11 key combination pressed - sending to renderer');
    mainWindow.webContents.send('alt-f11-pressed');
  });
});

app.on('will-quit', () => {
  // Unregister all shortcuts when the app is quitting
  globalShortcut.unregisterAll();
});
