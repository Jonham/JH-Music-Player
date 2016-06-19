//utils: test if file isFile
var isFile = function( file ) {
    return
    !!( typeof(file) === 'object' &&
        file.size >= 0 &&
        file.toString &&
        file.toString() === '[object File]');
    };

module.exports = isFile;
