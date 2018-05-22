const Chart = require('chart.js');
const { fork } = require('child_process');
const { getRandomInt, getRandomColor, formatBytes, formatTitle } = require('./utils');
const ctx = document.getElementById("donut").getContext("2d");
const path = require('path');
let dir;
let donut;
let dirData;

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

    dirData = data;
    dirData.children = dirData.children.sort(function(a, b) {
        return b.size - a.size;
    });

    // Create an entry for the 15 largest children
    let count = 0;
    while (count < 16 && count < dirData.children.length) {
        let cur = dirData.children[count];
        chartValues.labels.push(path.basename(cur.name));
        chartValues.datasets[0].data.push(cur.size);
        chartValues.datasets[0].backgroundColor.push(getRandomColor());
        count++;
    }

    // Aggregate the remaining files & folders into an 'other' section
    if (count < dirData.children.length) {
        let totalSize = 0;
        while (count < dirData.children.length) {
            let cur = dirData.children[count];
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
            onClick: function (e, elements) {
                if (elements.length) {
                    let element = dirData.children[elements[0]._index];
                    console.log(element);
                    if (element.type === "directory") {
                        stepIn(element);
                    }
                }
            },
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

function stepIn(element) {
    element.parent = dirData;
    donut.data = formatChartValues(element);
    donut.options.title.text = formatTitle(element.name);
    donut.update();
}

function stepOut() {
    console.log("hey");
    if (dirData.parent) {
        donut.data = formatChartValues(dirData.parent);
        donut.options.title.text = formatTitle(dirData.name);
        donut.update();
    }
}



/** Start creating the chart on document load */
window.onload = function() {
    const worker = fork("findSize.js");
    worker.on('message', data => {
        console.log(data);
        generateChart(data);
        document.getElementById("loading").classList.add("hidden");
    });
    worker.send("C:\\Program Files");    
    document.getElementById("block").onclick = stepOut;
}


