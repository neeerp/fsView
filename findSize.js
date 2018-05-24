const fs = require('fs');
const path = require('path');

/** 
 * Returns an object containing data about the file, and its children
 * if the file was a directory.
 * 
 * @param {string} file A path to a file.
 * @return {Object} An object containing a file <name>, a file <type>,
 *  a file <size>, and a <children> array of the same sort of object.
 */
function findChildSizes(file) {
    try {
        var type = "File";
        var size = 0;
        var childAr;
        var stats = fs.statSync(file);
        if (stats.isDirectory()) { // File is a directory, recurse
            type = "Directory"
            let children = fs.readdirSync(file);

            childAr = children.map(child => {
                let childData = findChildSizes(path.join(file, child));
                size += childData.size;
                return childData;
            });
            
            childAr.sort(function(a, b) {
                return b.size - a.size;
            });
            childAr = consolidateAfterN(childAr, 20);
        } else { // File is a regular file
            size = stats.size ? stats.size : 0;
        }
    } catch (err) {} // Unreadable file; ignore it. 

    return {
        name: file,
        type: type,
        size: size ? size : 0,
        children: childAr
    }
}

/**
 * Consolidate the elements of the <files> array after and including the
 * <n>th element and return the consolidated element.
 * 
 * @param {Object[]} files An array of file objects.
 * @param {Number} n The cutoff point.
 * @return {Object} A file aggregation in the same format as the file objects
 *  generated by findChildSizes.
 */
function consolidateAfterN(files, n) {
    if (files.length > n) {
        let extra = files.slice(n);
        let size = 0;
        extra.forEach(element => {
            size += element.size;
        });
        let other = {
            name: "Other",
            type: "Aggregation",
            size: size
        };
        files = files.slice(0, n);
        files.push(other);
    }
    return files;
}

/** Upon being sent a directory, process its contents and send them back. */
process.on('message', dir => {
    process.send(findChildSizes(dir));
});
