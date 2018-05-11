const Chart = require('chart.js');
const {findChildSizes} = require('./findSize');
const {getRandomInt, getRandomColor, formatBytes} = require('./utils');

/**
 * Generates and formats the size data of a given directory so that
 * it may be represented as a chart.
 * 
 * @param {String} dir The absolute path to a directory.
 * @return {Object} A data object for a chart.js chart.
 */
function generateSizeChartData(dir) {
    let children = findChildSizes(dir).children.sort(function(a, b) {
        return b.size - a.size;
    });

    let paths = [];
    let sizes = [];
    let backgroundColor = [];
    let count = 0;

    while (count < 19 && count < children.length) {
        let cur = children[count];
        paths.push(cur.file);
        sizes.push(cur.size);
        backgroundColor.push(getRandomColor());
        count++;
    }

    let chartValues = {
        datasets: [{
            data: sizes,
            backgroundColor: backgroundColor
        }],
        labels: paths
    };

    // Aggregate the remaining files & folders into an 'other' section
    if (count < children.length) {
        let otherPaths = [];
        let otherSizes = [];
        let totalSize = 0;
        while (count < children.length) {
            let cur = children[count];
            otherPaths.push(cur.file);
            otherSizes.push(cur.size);
            totalSize += cur.size;
            count++;
        }

        chartValues.labels.push("Other");
        chartValues.datasets[0].backgroundColor.push(getRandomColor());
        chartValues.datasets[0].data.push(totalSize);
        chartValues.other = {
            labels: otherPaths,
            data: otherSizes 
        }
    }

    return chartValues
}

window.onload = function() {
    var data = generateSizeChartData("./node_modules");

    var ctx = document.getElementById("donut").getContext("2d");
    var donut = new Chart(ctx, {
        type: "doughnut",
        data: data,
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
