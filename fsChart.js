const Chart = require('chart.js');
const { fork } = require('child_process');
const { getRandomInt, getRandomColor, formatBytes, formatTitle } = require('./utils');
const ctx = document.getElementById("donut").getContext("2d");
const path = require('path');
let dir;
let donut;

/**
 * Formats the child size data of a given directory so that
 * it may be represented as a chart.
 * 
 * @param {Object} data An object as returned by the findChildSizes method in findSize.js.
 * @return {Object} A data object for a chart.js chart.
 */
function formatChartValues(data) {
    // Declare the chart data object
    let chartValues = {
        datasets: [{
            data: [],
            backgroundColor: []
        }],
        labels: []
    };

    // Children of the chosen directory, in sorted order
    let children = data.children.sort(function(a, b) {
        return b.size - a.size;
    });

    // Create an entry for the 15 largest children
    let count = 0;
    while (count < 16 && count < children.length) {
        let cur = children[count];
        chartValues.labels.push(path.basename(cur.name));
        chartValues.datasets[0].data.push(cur.size);
        chartValues.datasets[0].backgroundColor.push(getRandomColor());
        count++;
    }

    // Aggregate the remaining files & folders into an 'other' section
    if (count < children.length) {
        let totalSize = 0;
        while (count < children.length) {
            let cur = children[count];
            totalSize += cur.size;
            count++;
        }

        chartValues.labels.push("Other");
        chartValues.datasets[0].backgroundColor.push(getRandomColor());
        chartValues.datasets[0].data.push(totalSize);
    }

    return chartValues;
}

/**
 * Generates a donut chart in the given canvas, and replaces the spinner.
 * 
 * @param {Object} data A data object for a Chart.js chart 
 */
function generateChart(data) {
    donut = new Chart(ctx, {
        type: "doughnut",
        data: formatChartValues(data),
        options: {
            tooltips: {
                callbacks: {
                    label: (i, d) => {
                        let index = i.index;
                        let size = d.datasets[0].data[index];
                        let name = d.labels[index];
                        return name + ": " + formatBytes(d.datasets[0].data[i.index]);
                    }
                }
            },
            legend: {
                display: false
            },
            title: {
                display: true,
                position: 'bottom',
                text: formatTitle(data.name),
                fontSize: 18,
                fontStyle: "normal",
                fontFamily: "'Roboto', sans-serif",
                fontColor: '#d3d3d3',
                padding: 30
            }
        }
    });
}

/** Start creating the chart on document load */
window.onload = function() {
    const worker = fork("findSize.js");
    worker.on('message', data => {
        generateChart(data);
        document.getElementById("loading").classList.add("hidden");
    });
    worker.send("C:\\Program Files");    
}


