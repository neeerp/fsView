const {app, BrowserWindow, globalShortcut, ipcMain} = require('electron');
const path = require('path');
const url = require('url');


function main() {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600, resizable: false});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();
  win.setMenu(null);

  globalShortcut.register('f5', function() {
		win.reload();
  })
  
  // Send reply channel to the main window
  ipcMain.on('reply', (event, message) => {
    win.webContents.send('reply', message);
  });
  
}

app.on('ready', main);
