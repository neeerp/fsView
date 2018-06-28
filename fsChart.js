const electron = require('electron');
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const BrowserWindow = remote.BrowserWindow
const path = require('path');
const { initializeChart, stepOut, updateChart } = require('./chart.js');

// TODO: Modularize this so that it's self contained. Should probably separate anything graph related
// from anything relating to communicating between processes.

/** Global variables */
let worker;


/** Create a child window and send it a work request. */
function getDirs(dir) {
    worker = new BrowserWindow({show: false});
    worker.loadURL(path.join(__dirname, 'worker.html'));
    worker.webContents.on('did-finish-load', () => {
        worker.webContents.send('message', dir);
    });
}

ipc.on('reply', (event, data) => {
    console.log(data);
    initializeChart();
    updateChart(data, true);
    worker = null;
    document.getElementById("loading").classList.add("hidden");
})


/**
 * Prompt the user to select a new directory, and then clear the screen
 * and generate a new graph.
 */
function resetGraph() {
    var newDir = remote.dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if(newDir) {
        // Replace chart with loading screen
        document.getElementById("donut").classList.add("hidden");
        document.getElementById("loading").classList.remove("hidden");
        getDirs(newDir[0])
    }
}

/** Set up event handlers and start generating an initial chart. */
window.onload = function() {  
    getDirs(".");
    document.getElementById("back").onclick = stepOut;
    document.getElementById("new").onclick = resetGraph;
}
