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
        var type = "file";
        var size = 0;
        var childAr;
        var stats = fs.statSync(file);
        if (stats.isDirectory()) { // File is a directory, recurse
            type = "directory"
            let children = fs.readdirSync(file);

            childAr = children.map(child => {
                let childData = findChildSizes(path.join(file, child));
                size += childData.size;
                return childData;
            });
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

/** Upon being sent a directory, process its contents and send them back. */
process.on('message', dir => {
    process.send(findChildSizes(dir));
});
