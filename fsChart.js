const Chart = require('chart.js');
const { fork } = require('child_process');
const { getRandomInt, getRandomColor, formatBytes, formatTitle } = require('./utils');
const ctx = document.getElementById("donut").getContext("2d");
const path = require('path');
let donut;
let dirStack;
let currentDir;

/**
 * Generates a donut chart in the given canvas, and replaces the spinner.
 * 
 * @param {Object} data A data object for a Chart.js chart 
 */
function initializeChart() {
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
    donut.options.title.text = "Current Directory: " + data.name;
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

function stepIn(e, elements) {
    if (elements.length) {
        let nextDir = currentDir.children[elements[0]._index];
        if (nextDir.type === "Directory") {
            dirStack.push(currentDir);
            updateChart(nextDir);
        }
    }
}

function stepOut() {
    if (dirStack.length) {
        let nextDir = dirStack.pop();
        updateChart(nextDir);
    }
}

/** Start creating the chart on document load */
window.onload = function() {
    const worker = fork("findSize.js");
    worker.on('message', data => {
        console.log(data);
        dirStack = [];
        if (!donut) {initializeChart()};
        updateChart(data);
        document.getElementById("loading").classList.add("hidden");
    });
    worker.send("C:\\Program Files");    
    document.getElementById("block").onclick = stepOut;
}
