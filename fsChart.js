var Chart = require('chart.js');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    let color = "rgb(" + 
        getRandomInt(0, 255) + "," +
        getRandomInt(0, 255) + "," +
        getRandomInt(0, 255) + ")";

    return color;
}

window.onload = function() {
    var dataset = {
        datasets: [{
            data: [39.10, 32.51, 13.68, 8.71, 6.01],
            backgroundColor: [
                getRandomColor(),
                getRandomColor(),
                getRandomColor(),
                getRandomColor(),
                getRandomColor()
            ]
        }],
        labels: [
            "IE", "Chrome", "Safari", "Firefox", "Others"
        ]
    };

    var ctx = document.getElementById("donut").getContext("2d");
    var donut = new Chart(ctx, {
        type: "doughnut",
        data: dataset,
        options: {}
    });

    console.log(ctx);
    console.log(donut);
}
