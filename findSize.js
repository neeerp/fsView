const {readdirAsync, statAsync} = require('./utils');
const path = require('path');

/**
 * Given a path to a directory, returns a list of its children
 * and their sizes.
 * 
 * @param {String} dir The path to the directory 
 * @return {Promise} A promise resolving to an array of objects
 *  containing a file name and its respective size.
 */
function findChildSizes(dir) {
    return readdirAsync(dir)
    .then(function (files) {
        var promises = files.map(function (file) {
            return new Promise(function(resolve, reject) {
                getSize(path.join(dir, file)).then(function (size) {
                    resolve({
                        file: file,
                        size: size
                    });
                })
                .catch(err => { // Handle unreadable children by setting size null
                    resolve({
                        file: file,
                        size: null
                    });
                });
            });
        });

        return Promise.all(promises);
    })
    .then(children => {
        return children.filter(child => child.size !== null);
    });
}

/**
 * Given a path to a file/directory, find its size recursively.
 * 
 * @param {String} filePath The path to the file.
 * @return {Promise} A promise resolving to the size of the file. 
 */
function getSize(filePath) {
    return statAsync(filePath).then(function(stat) {
        if (stat.isFile()) {
            return stat.size;
        } else {
            return readdirAsync(filePath)
            .then(function(files) {
                var promises = files.map(function(file) {
                    return path.join(filePath, file);
                })
                .map(getSize) // Recurse on directory's children
                .map(promise => promise.catch(err => {
                    // Handle unreadable files by setting their size to 0
                    return 0;
                }));

                return Promise.all(promises);
            })
            .then(function(children) {
                var size = 0;
                children.forEach(function(childSize) {
                    size += childSize;
                });

                return size;
            })
        }
    });
}

// findChildSizes("C:/").then(function(size){
//     console.log(size);
// }).catch(console.error.bind(console));

module.exports = {
    findChildSizes
};