//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipc = electron.ipcMain;
const path = require('path');
const url = require('url');

function main() {
  let mainWindow;
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, resizable: false});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();
  mainWindow.setMenu(null);

  // globalShortcut.register('f5', function() {
  //   mainWindow.reload();
  // })
  
  // Send reply channel to the main window
  ipc.on('reply', (event, message) => {
    mainWindow.webContents.send('reply', message);
  });
  
}
 
app.on('ready', main);

app.on('window-all-closed', () => {
  app.quit();
});

