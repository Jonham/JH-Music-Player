var AlbumCover = require("./AlbumCoverClass.js");

var isCover = function( cover ) {
    return cover &&
           cover.constructor &&
           cover.constructor === AlbumCover;
};

module.exports = isCover;
