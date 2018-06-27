const Chart = require('chart.js');
const { fork } = require('child_process');
const { getRandomInt, getRandomColor, formatBytes, formatTitle } = require('./utils');
const { remote } = require('electron');
const path = require('path');
const ipc = require('electron').ipcRenderer;
const BrowserWindow = require('electron').remote.BrowserWindow;

// TODO: Modularize this so that it's self contained. Should probably separate anything graph related
// from anything relating to communicating between processes.

/** Global variables */
let donut;
let dirStack;
let currentDir;
let worker;


/** Create a child window and send it a work request. */
function getDirs(dir) {
    worker = new BrowserWindow({show: false});
    worker.loadURL(path.join(__dirname, 'worker.html'));
    worker.webContents.on('did-finish-load', () => {
        worker.webContents.send('message', dir);
    });
}

ipc.on('reply', (event, message) => {
    console.log(message);
    dirStack = [];
    initializeChart();
    updateChart(message);
    worker = null;
    document.getElementById("loading").classList.add("hidden");
})

/**
 * Sets up a new canvas, replaces the spinner, and generates a new chart with
 * no data.
 * 
 * @param {Object} data A data object for a Chart.js chart 
 */
function initializeChart() {
    var canvas = "<canvas id=\"donut\" />";
    document.getElementById("chart-container").innerHTML = canvas;
    let ctx = document.getElementById("donut").getContext("2d");

    donut = new Chart(ctx, {
        type: "doughnut",
        options: {
            onClick: stepIn,
            tooltips: {
                callbacks: {
                    label: (t, d) => {
                        let index = t.index;
                        let size = d.datasets[0].data[index];
                        let name = d.labels[index];
                        return name + ": " + formatBytes(d.datasets[0].data[index]);
                    },
                    afterLabel: (t, d) => {
                        let index = t.index;
                        let type = d.datasets[0].fileType[index];
                        return "Type: " + type;
                    }
                }
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                position: 'bottom',
                fontSize: 18,
                fontStyle: "normal",
                fontFamily: "'Roboto', sans-serif",
                fontColor: '#d3d3d3',
                padding: 30
            }
        }
    });
}

/**
 * Update the chart's data with a new file directory.
 * 
 * @param {Object} data A file object.
 */
function updateChart(data) {
    currentDir = data;
    donut.data = formatChartData(data);
    donut.options.title.text = formatTitle(data.name);
    donut.update();
}

/**
 * Given a file object, formats it into data usable by the donut
 * chart.
 * 
 * @param {Object} data A file object.
 * @return {Object} A data object for a chart.js chart.
 */
function formatChartData(data) {
    let children = data.children;
    return {
        labels: children.map(obj => {
            return path.basename(obj.name);
        }),
        datasets: [{
            data: children.map(obj => {
                return obj.size;
            }),
            backgroundColor: children.map(obj => {
                return getRandomColor();
            }),
            fileType: children.map(obj => {
                return obj.type;
            })
        }]
    }
}

/**
 * Prompt the user to select a new directory, and then clear the screen
 * and generate a new graph.
 */
function resetGraph() {
    var newDir = remote.dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if(newDir) {
        document.getElementById("chart-container").innerHTML = null;
        document.getElementById("loading").classList.remove("hidden");
        getDirs(newDir[0])
        //worker.send(newDir[0]);
    }
}

/**
 * Update the graph to view the selected directory instead.
 * @param {A list of clicked objects} elements 
 */
function stepIn(e, elements) {
    if (elements.length) {
        let nextDir = currentDir.children[elements[0]._index];
        if (nextDir.type === "Directory") {
            dirStack.push(currentDir);
            updateChart(nextDir);
        }
    }
}

/**
 * Update the graph to view the previous directory instead.
 */
function stepOut() {
    if (dirStack.length) {
        let nextDir = dirStack.pop();
        updateChart(nextDir);
    }
}




/** Set up event handlers and start generating an initial chart. */
window.onload = function() {  
    getDirs(".");
    document.getElementById("back").onclick = stepOut;
    document.getElementById("new").onclick = resetGraph;
}
