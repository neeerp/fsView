const fs = require('fs');
const path = require('path');

/** 
 * Returns an object containing an array of the given directory's
 * children and their sizes, as well as the total size of the 
 * directory in bytes.
 * 
 * @param {string} dir The path to a directory.
 * @return {Object} An object containing a <children> array whose elements
 *  contain a <file> name and its <size>, and a <total> which is just the sum
 *  of all of the children's sizes.
 */
function findChildSizes(dir) {
    // directories that can't be read
    try {
        var files = fs.readdirSync(dir);
    } catch (err) { return 0; }

    var childAr = [];
    var total = 0;
    for (let i = 0; i < files.length; i++) {
        var size = findSize(dir + "/" + files[i]);
        if (isNaN(size)) continue; // Ignore files with invalid size
        childAr.push({
            file: files[i],
            size: size
        });
        total += size;
    }

    return {children: childAr, totalSize: total, name: dir};
}

/** 
 * Returns the size of a file (or directory, recursively) in bytes.
 * 
 * @param {string} file The path to a file or directory.
 * @return {number} The file size in bytes.
 * */
function findSize(file) {
    // Ignore files & directories that can't be statted
    try {
        var stats = fs.statSync(file);
    } catch(err) { return 0; }
    
    var size = stats.size;
    if (stats.isDirectory()) {
        size += findChildSizes(file).totalSize;
    }

    return size;
}

/** Upon being sent a directory, process its contents and send them back. */
process.on('message', dir => {
    process.send(findChildSizes(dir));
});
