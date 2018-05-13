const fs = require('fs');

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
 * An asynchronous version of lstat which returns a promise.
 * 
 * @param {String} file The file to stat.
 * @return {Promise} 
 */
function statAsync(file) {
    return new Promise(function (resolve, reject) {
        fs.lstat(file, function(err, stat) {
            if (err) return reject(err);
            resolve(stat);
        })
    });
}

/**
 * An asynchronous version of readdir which returns a promise.
 * @param {String} dir The directory to read.
 * @return {Promise}
 */
function readdirAsync(dir) {
    return new Promise(function (resolve, reject) {
        fs.readdir(dir, function(err, files) {
            if (err) reject(err);
            resolve(files);
        });
    });
}

module.exports = {
    getRandomInt,
    getRandomColor,
    formatBytes,
    statAsync,
    readdirAsync
};