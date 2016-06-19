var _ = require('../../lib/underscore-min.js');
var $ = require('../../getter/$getter.js');

// Image File : album covers
var AlbumCover = function( file ) {
    var me = this;
    if (me === window) { return new AlbumCover( file ); }

    me.constructor = AlbumCover;

    me._file = me._buffer = null;
    me.fileName = me.size = me.type = null; // messages from File
    me.title = me.artist = null;

    me.states = {
        init: false,
        analyseFilename: false,
        readFile: false
    };
    me.ASYNCHRONOUS = false;

    // if get argument file
    if ( isFile(file) ) { me.init( file ); }

    return me;
};


AlbumCover.prototype = {
    init: function( file ) {
        var me = this;

        if (!isFile(file)) { throw new Error('AlbumCover.init() receive something but file.'); }
        else {
            if (me.states.init) { console.error('Each Song can only init once.'); return me;}

            me._file = file;
            me.states.init = true;

            me.fileName = file.name;
            me.size = file.size;
            me.type = file.type;


            // analyseFilename for SongList update information
            me.analyseFilename();
        }
    },
    analyseFilename: function() {
        var me = this;

        // main works
        // get rid of subfix
        var name = this.fileName.substring(0, me.fileName.lastIndexOf('.') );
        // JH-bugs: what if fileName not obey standard 'ARTIST-TITLE'
        if (name.search('-') === -1) {
            console.warn('AlbumCover: Not a Regular Filename.');
            me.title = name.trim();
            return me;
        }

        var result = name.split('-');
        me.artist = result[0].trim(); result.shift();
        me.title = result.length === 1? result[0].trim(): result.join('-').trim();

        me.states.analyseFilename = true;

        return me;
    },
    //Notes: readFile is an asynchronous function
    readFile: function GetFileUsingFileReader( callback ) { // asynchronous function
        var me = this;
        if (me.states.readFile) { typeof(callback) === 'function' && callback(); return me;}
        if (me.ASYNCHRONOUS) { throw new Error('AlbumCover is processing.'); }

        me.ASYNCHRONOUS = true;

        var fr = new FileReader();
        fr.readAsDataURL(me._file);

        fr.onload = function(e) {
            me._buffer = fr.result;
            me.states.readFile = true;
            console.log('AlbumCover: ' + me.title + ' loaded.');

            me.ASYNCHRONOUS = false;
            typeof(callback) === 'function' && callback();
        };
        fr.onerror = function(e) {
            console.error(e);
            me.ASYNCHRONOUS = false;
            throw new Error('AlbumCover load buffer failed.');
        };
        return me;
    },
    setBackgroundTo: function setBackgroundTo( target ) {
        if(!$.isDOMElement(target) && !$.isDOMElement(target[0])) { return false; }
        var me = this;
        if (!me.states.readFile) { me.readFile(function(){ me.setBackgroundTo( target ); }); return me; }

        // var createStyle = NS.util.createStyle;
        // createStyle.createTag('.icon-userIcon: { background-image: url("' + me._buffer + '") !important;')
        //            .insert();
        Toast.log('new album cover already set.');

        if (_.isArray(target)) {
            _.each(target, function(item){ item.style.backgroundImage = 'url(' + me._buffer + ")"; });
        } else {
            target.style.backgroundImage = 'url(' + me._buffer + ")";
        }
        return me;
    },
};

module.exports = AlbumCover;
