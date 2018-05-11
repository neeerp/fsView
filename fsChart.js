const Chart = require('chart.js');
const { findChildSizes } = require('./findSize');

/**
 * Generate an integer in the given range.
 * 
 * @param {Number} min The lower end of the range.
 * @param {Number} max The upper end of the range.
 * @return {Number} An integer within [min, max].
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random RGB color.
 * 
 * @return {String} an RGB color string.
 */
function getRandomColor() {
    let color = "rgb(" + 
        getRandomInt(0, 255) + "," +
        getRandomInt(0, 255) + "," +
        getRandomInt(0, 255) + ")";

    return color;
}

/**
 * Takes a number of bytes and outputs the number rounded and with
 * the relevant unit (i.e. B, KB, MB, GB).
 * 
 * @param {Number} bytes A number of bytes.
 * @return {String} The above number of bytes formatted with the relevant unit.
 */
function formatBytes(bytes) {
    if (bytes < 1024) {
        return bytes + " B";
    } else if (bytes < 1024 * 1024) {
        return Math.floor(bytes / 1024) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
        return Math.floor(bytes / (1024 * 1024)) + " MB";
    } else {
        return Math.floor(bytes / (1024 * 1024 * 1024)) + " GB";
    }
}

/**
 * Generates and formats the size data of a given directory so that
 * it may be represented as a chart.
 * 
 * @param {String} dir The absolute path to a directory.
 * @return {Object} A data object for a chart.js chart.
 */
function generateSizeChartData(dir) {
    let children = findChildSizes(dir).children.sort(function(a, b) {
        return a.size - b.size;
    });

    let paths = [];
    let sizes = [];
    let backgroundColor = [];

    children.forEach(e => {
        paths.push(e.file);
        sizes.push(e.size);
        backgroundColor.push(getRandomColor());
    });

    return {
        datasets: [{
            data: sizes,
            backgroundColor: backgroundColor
        }],
        labels: paths
    };
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
            }
        }
    });

}