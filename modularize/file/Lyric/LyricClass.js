var _ = require('../../lib/underscore-min.js');
var $ = require('../../getter/$getter.js');

// Lyric File
var Lyric = function Lyric( file ) {
    var me = this;
    if (me === window) { return new Lyric( file ); }

    me.constructor = Lyric;

    me._file = me._buffer = null;
    me.fileName = me.size = me.type = null; // messages from File
    me.title = me.artist = null;

    me.states = {
        init: false,
        analyseFilename: false,
        readFile: false,
        decode: false
    };
    me.ASYNCHRONOUS = false;

    // if get argument file
    if ( isFile(file) ) { me.init( file ); }

    return me;
};


Lyric.prototype = {
    init: function( file ) {
        var me = this;

        if (!isFile(file)) { throw new Error('Lyric.init() receive something but file.'); }
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
        var name = me.fileName.substring(0, me.fileName.lastIndexOf('.') );
        // JH-bugs: what if fileName not obey standard 'ARTIST-TITLE'
        if (name.search('-') === -1) {
            console.warn('Lyric: Not a Regular Filename.');
            me.title = name.trim();
            return me;
        }
        var result = name.split('-');
        me.artist = result[0].trim(); result.shift();
        me.title  = result.length === 1? result[0].trim(): result.join('-').trim();
        me.states.analyseFilename = true;

        return me;
    },
    //Notes: readFile is an asynchronous function
    readFile: function GetFileUsingFileReader( callback, DOMEncoding ) { // asynchronous function
        var me = this;
        if (me.states.readFile) { typeof(callback) === 'function' && callback(); return me;}
        if (me.ASYNCHRONOUS) { throw new Error('Lyric is processing.'); }

        // main work
        me.ASYNCHRONOUS = true;

        var fr = new FileReader();
        fr.readAsText(me._file, DOMEncoding || 'GB2312');

        fr.onload = function(e) {
            me._buffer = fr.result;
            me.states.readFile = true;
            console.log('Lyric: ' + me.title + ' loaded.');

            me.ASYNCHRONOUS = false;
            typeof(callback) === 'function' && callback();
        };
        fr.onerror = function(e) {
            console.error(e);
            me.ASYNCHRONOUS = false;
            throw new Error('Lyric load buffer failed.');
        };

        return me;
    },
    // notice: file encoding:
    // utf-8
    // ANSI
    // UCS2 BigEndian
    //      LittleEndian
    decode: function( callback ) {
        // parse lrc into Array Object
        // Example
        //[ti:Rolling In The Deep]
        //[ar:
        //Adele]
        //[al:21]
        // ==> ['ti:Rolling In The Deep',
        //      'ar:Adele',
        //      'al:21']
        var splitLyricString = function splitLyricString( lyricString ) { // split by '[' or ']'
            var rg = /[\[\]]/g;
            var arr = lyricString.split(rg);

            // combine multi-line content into one line
            // by replacing '\n'
            _.map(arr, function( str ) {
                return str.replace("\n", '');
            });

            return arr;
        };
        var classifyLyric = function classifyLyric(arr) {
            // two modes
            // 1. one TimeStamp one lyrics        normal
            // 2. several timeTags one lyrics   compressd

            // metamsg RegExp
            // ti : title
            // ar : artist
            // al : album
            // by : lyric maker
            var rgMetaMsg = /(ti|ar|al|by|offset):(.+)/,
                isMeta = function(str) { return rgMetaMsg.test(str); }
            // timetag regexp
            // 1. mm:ss.ms
            var rgTimetag = /^(\d{2,}):(\d{2})[.:]{1}(\d{2})$/,
                isTimetag = function(str) { return rgTimetag.test(str); }

            // function(timetag): to transform
            // "01:01.01" ==> 60 + 1 + .01
            var parseTimetag = function(timetag) {
                var aTMP = rgTimetag.exec(timetag);
                var floatTime = parseInt(aTMP[1]) * 60 + parseInt(aTMP[2]) + parseInt(aTMP[3]) / 100;
                return floatTime;
            };


            // returnArrayObject
            // prototype oResult[12.34] = []
            var oResult = {},
                lyrics = [],
                timeTags = [];

            // go through the array
            for (var i=0; i < arr.length; i++) {
                if ( isMeta( arr[i] ) ) {         // handling meta messages
                    var aTMP = rgMetaMsg.exec(arr[i]);
                    oResult[aTMP[1]] = aTMP[2];
                }
                else if( isTimetag( arr[i] ) ) { // handling timestamp and lyrics

                    // in compress mode:
                    // to collect series of timestamp
                    var timetagsofOneLyric = [];

                    // collect all timeTags
                    while ( isTimetag(arr[i]) ) {
                        var floatTime = parseTimetag(arr[i]);
                        timetagsofOneLyric.push( floatTime );
                        timeTags.push( floatTime );
                        i++;
                    }

                    // collect this line of lyric
                    var lyriccontent = arr[i].search(/[^\s]/g) !== -1? arr[i] : '...'; // to place a '_' in empty lines
                    lyrics.push( lyriccontent );
                    var indexOftheLyric = lyrics.length - 1;

                    // restore timetagsofOneLyric to oResult
                    // oResult[ sNow ] = [ ref to index of lrc ]
                    _.each(timetagsofOneLyric, function( tag ) {
                        if (oResult[ tag ]) {
                            oResult[ tag ].push( indexOftheLyric );
                        } else {
                            oResult[ tag ] = [ indexOftheLyric ];
                        }
                    });
                }
            }


            // sort
            var sortByNumber = function(a, b) { return a>b? 1: -1; };
            timeTags.sort(sortByNumber);

            oResult.timeTags = timeTags;
            oResult.lyrics = lyrics;
            return oResult;
        };

        var me = this;
        if (!me.states.readFile) { me.readFile(function(){ me.decode(callback); }); return me; }

        me[0] = classifyLyric( splitLyricString(me._buffer) );

        me.states.decode = true;

        typeof(callback) === 'function' && callback();
        return me;
    },
    generate: function() {
        var me = this;
        if (!me.states.readFile) { me.readFile(function(){ me.decode(); me.generate(); return me; }); }

        var wrapper = me[0],
            lyrics = wrapper.lyrics,
            tags = wrapper.timeTags,
            ul = $dom('ul');

        _.each(tags, function( tag ) {
            var index = wrapper[tag];
            var li = $dom('li');
            li.className = 'line';
            li.dataset.line = index;
            li.innerHTML = lyrics[index];
            ul.appendChild(li);
        });
        return ul.innerHTML;
    },
};

module.exports = Lyric;
