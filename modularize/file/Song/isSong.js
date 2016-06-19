var Song = require('./SongClass.js');

var isSong = function( song ) {
    return song && song.constructor && song.constructor === Song;
};

module.exports = isSong;
