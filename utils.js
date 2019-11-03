const path = require('path');

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
 * Given the name of a directory, generate a title that fits within
 * max(70, base name of path) characters
 * 
 * @param {String} name The name of a directory.
 * @return {String} A title string no longer than 70 characters. 
 */
function formatTitle(name) {
    if (name.length > 70) {
        name = "\\...\\" + path.basename(name);
    }
    var title = "Current Directory: " + name;
    return title;
}

module.exports = {
    getRandomInt,
    getRandomColor,
    formatBytes,
    formatTitle
};
