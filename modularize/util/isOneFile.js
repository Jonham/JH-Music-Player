var isFile = require('./isFile.js');
//utils: compare file
var isOneFile = function( fileA, fileB ) {
    if (isFile(fileA) && isFile(fileB)) {
        if (fileA.size === fileB.size && fileA.name === fileB.name) {
            return true;
        }
    }
    return false;
};

module.exports = isOneFile;
