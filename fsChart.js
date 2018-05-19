const Chart = require('chart.js');
const { fork } = require('child_process');
const { getRandomInt, getRandomColor, formatBytes } = require('./utils');

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

    // Create an entry for the 19 largest children
    let count = 0;
    while (count < 19 && count < children.length) {
        let cur = children[count];
        chartValues.labels.push(cur.file);
        chartValues.datasets[0].data.push(cur.size);
        chartValues.datasets[0].backgroundColor.push(getRandomColor());
        count++;
    }

    // Aggregate the remaining files & folders into an 'other' section
    if (count < children.length) {
        let totalSize = 0;
        while (count < children.length) {
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
    let chartData = formatChartValues(data);
    var ctx = document.getElementById("donut").getContext("2d");
    document.getElementById("spinner").style.display = "none";
    var donut = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
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
                position: 'right'
            }
        }
    });
}

/** Start creating the chart on document load */
window.onload = function() {
    const worker = fork("findSize.js");
    worker.on('message', data => {
        generateChart(data);
    });
    worker.send(".");    
}
