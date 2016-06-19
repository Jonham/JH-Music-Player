var Lyric = require("./LyricClass.js");

var isLyric = function( lyric ) {
    return lyric && lyric.constructor && lyric.constructor === Lyric;
};

module.exports = isLyric;
