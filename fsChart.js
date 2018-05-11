const Chart = require('chart.js');
const { findChildSizes } = require('./findSize');

/**
 * Generate an integer in the given range.
 * 
 * @param {Number} min The lower end of the range
 * @param {Number} max The upper end of the range
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random RGB color.
 */
function getRandomColor() {
    let color = "rgb(" + 
        getRandomInt(0, 255) + "," +
        getRandomInt(0, 255) + "," +
        getRandomInt(0, 255) + ")";

    return color;
}

/**
 * Generates and formats the size data of a given directory so that
 * it may be represented as a chart.
 * 
 * @param {String} dir The absolute path to a directory
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
        sizes.push(e.size / 1024);
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
        options: {scaleLabel: "MB"}
    });

}