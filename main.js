const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipc = electron.ipcMain;
const path = require('path');
const url = require('url');

let mainWindow;

function main() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, resizable: false});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);

  globalShortcut.register('f5', function() {
		mainWindow.reload();
  })
  
  // Send reply channel to the main window
  ipc.on('reply', (event, message) => {
    mainWindow.webContents.send('reply', message);
  });
  
}

app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});