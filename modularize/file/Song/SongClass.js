var $ = require('../../getter/$getter.js');
// Song wrapper for each song

// "I think maybe I just quit and go back home to make noodles."
// I think this gay works like a Promise
var Song = function ( file ) {
    var me = this;
    if (me === window) { return new Song( file ); }

    me.constructor = Song;

    me.states = {
        init: false,
        analyseFilename: false,
        readFile: false,
        decode: false,
        createBufferSource: false,
    };

    me.context = ctx; // AudioContext
    me.ASYNCHRONOUS = false;    // is this song doing asynchronous works

    // init
    me._file = null;
    me.fileName = me.size = me.type = null; // messages from File
    me.title = me.artist = null;
    // getBuffer
    me._buffer = null;
    // decode
    me._audioBuffer = null;
    // createBufferSource
    me.output = me.bufferSourceNode = me.gainNode = null;
    // message after audio decode
    me.duration = null;
    // playing states
    me.PAUSED = false;
    me.STOPPED = false;

    // wrapped as an Audio object
    me.currentTime = 0; // like audio
    me.timeOffset = 0;  // offset between audio.currentTime and ctx.currentTime
    me.__timer = null;  // for requestAnimationFrame to store ID
    me.__TIMEUPDATE = false;

    // if get argument file
    if ( isFile(file) ) { me.init( file ); }

    return me;
};

Song.prototype = {

    init: function InitwithAudioFileBuffer( file ) {
        var me = this;
        if (!isFile(file)) {
            throw new Error('Song.init() receive something but file.');
        }
        else {
            if (me.states.init) { console.error('Each Song can only init once.'); return me;}

            me._file = file;
            me.states.init = true;

            me.fileName = file.name;
            me.size = file.size;
            me.type = file.type;

            // analyseFilename for SongList update information
            me.analyseFilename(); // filling title,artist

        }
    },


    analyseFilename: function() {
        var me = this;

        // main works
        // get rid of subfix
        var name = me.fileName.substring(0, me.fileName.lastIndexOf('.') );
        // JH-bugs: what if fileName not obey standard 'ARTIST-TITLE'
        if (name.search('-') === -1) {
            console.warn('Song: Not a Regular Filename.');
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
    readFile: function ReadFileUsingFileReader( callback ) { // asynchronous function
        var me = this;
        if (me.states.readFile) { typeof(callback) === 'function' && callback(); return me;}
        if (me.ASYNCHRONOUS) { throw new Error('Song is processing.'); }

        // main work
        me.ASYNCHRONOUS = true;

        Toast.log('reading file: ' + me.fileName);
        var fr = new FileReader();
        fr.readAsArrayBuffer( me._file );
        fr.onload = function(e) {
            me._buffer = fr.result;
            me.states.readFile = true;

            Toast.log(me.title + ' loaded.', 'fast');
            console.log('Song: ' + me.title + ' loaded.');

            me.ASYNCHRONOUS = false;
            typeof(callback) === 'function' && callback();
        };
        fr.onerror = function(e) {
            console.error(e);
            me.ASYNCHRONOUS = false;
            throw new Error('Song load buffer failed.');
        };
        return me;
    },


    //Notes: decode is an asynchronous function
    decode: function DecodeAudioData( callback ) { // asynchronous function
        var me = this;
        if (!me.states.readFile) { me.readFile(function(){ me.decode(callback); }); return me;}
        if (me.states.decode) { typeof(callback) === 'function' && callback(); return me;}
        if (me.ASYNCHRONOUS) { throw new Error('Song is processing.'); }


        // main work
        me.ASYNCHRONOUS = true;
        // decode using AudioContext
        Toast.log('decoding audio: ' + me.title);
        ctx.decodeAudioData(me._buffer, function( audioBuffer ) {
            me._audioBuffer = audioBuffer;
            me.states.decode = true;
            Toast.log(me.title + ' decoded.');

            me.ASYNCHRONOUS = false;
            typeof(callback) === 'function' && callback();
        });
        return me;
    },


    createBufferSource: function ( callback ) { // if you want to play one more time
        var me = this;
        if (!me.states.decode) { me.decode(function(){ me.createBufferSource(callback); }); return me;}

        // main works
        var bs = ctx.createBufferSource();
        bs.buffer = me._audioBuffer;
        bs.onended = function(e) {
            me.STOPPED = true;
            controller.songEnd( me ); // callback with song
            console.log('SongEnd: ' + me.title);
        };

        if(me.bufferSourceNode) { me.bufferSourceNode.disconnect(); }
        me.bufferSourceNode = bs;

        me.currentTime = 0;
        me.timeOffset = 0;
        cancelAnimationFrame( me.__timer );
        me.__TIMEUPDATE = false;

        // if there is a gainNode, connect to it
        if (me.gainNode) { bs.connect(me.gainNode); }
        // otherwise, set bufferSourceNode to me.output
        else { me.output = bs; }

        me.states.createBufferSource = true;

        typeof(callback) === 'function' && callback( me.bufferSourceNode );
        return me;
    },


    getDuration: function GetSongDuration() {
        var me = this;
        if (!me.states.decode) { me.decode(function(){ me.getDuration(); }); return me;}

        me.duration = me._audioBuffer.duration;
        return me.duration;
    },


    createGain: function createGain() {
        var me = this;
        if (!me.states.createBufferSource) { me.createBufferSource(function(){ me.createGain(); }); return me;}

        // if can't get one, create one
        if (!me.gainNode) { me.gainNode = ctx.createGain(); }

        me.bufferSourceNode.connect(me.gainNode);
            me.output = me.gainNode;

        return me;
    },


    connect: function ConnectSongToAudioContext( anotherAudioContextNode ) {
        var me = this;
        me.readFile(function() {
            me.decode(function() {
                me.createBufferSource();
                me.getDuration();
                me.createGain();

                if (anotherAudioContextNode && anotherAudioContextNode.disconnect) {
                    me.output.connect( anotherAudioContextNode );
                }
                else {
                        // get a function
                    if ( typeof(anotherAudioContextNode) === 'function' ) { anotherAudioContextNode(); }
                    me.output.connect( headGain );
                }
            });
        });

        return me;
    },

    play: function() {
        var me = this;
        var lastone = NS.audio.currentPlayingSong;
        var tagTotalTime = $('#tag-totalTime'),
            format = NS.util.formatTimestamp;

        // view works
        NS.dom.viewDisk.node.turnOn();
        // console.warn(me.title + me.artist);
        NS.dom.tagSongMessage.node.update( me.title, me.artist );
        // JH-bugs: me.artist is not defined
        NS.lyric.lookup( me.title );

        try {
            // play one song only
            if (lastone && lastone !== me) { lastone.stop(); }

            // when audio had been PAUSED
            if (me.PAUSED) { // if play after pause, just connect to headGain
                me.output.connect(NS.audio.headGain);

                tagTotalTime.innerHTML = format( me.duration );

                me.timeupdate();

                me.PAUSED = false;
                me.STOPPED = false;
                return me;
            }

            // when audio had been stop
            if (me.STOPPED) { // create newe buffersource if me had been stop
                me.createBufferSource(function() {
                    me.STOPPED = false;
                    me.PAUSED = false;
                    me.play();
                    me.getDuration();
                    tagTotalTime.innerHTML = format( me.duration );

                    me.currentTime = 0;
                    me.timeupdate();
                });
                return me;
            }

            NS.audio.currentPlayingSong = me;
            if (me.states.decode) {
                // play if bufferSourceNode was never been played
                me.createBufferSource();
                me.createGain();
                me.output.connect(NS.audio.headGain);

                me.bufferSourceNode.start(0);
                me.getDuration();
                tagTotalTime.innerHTML = format( me.duration );

                me.currentTime = 0;
                me.timeupdate();
            }
            else {
                // use connect to handle all asynchronous functions
                me.connect( function() {
                    if (NS.audio.currentPlayingSong !== me) { return false; }
                    me.bufferSourceNode.start(0);
                    me.getDuration();
                    tagTotalTime.innerHTML = format( me.duration );

                    me.currentTime = 0;
                    me.timeupdate();
                });
            }

        }
        catch(e) { // bufferSourceNode is already play
            console.log(e);
            me.output.disconnect();

            me.createBufferSource(function(bufferSource) {
                me.createGain();
                me.play();
            });
        }
        return me;
    },


    playAt: function( time ) {
        var me = this;

        if (me.__TIMEUPDATE) {
            cancelAnimationFrame( me.__timer );
            me.__TIMEUPDATE = false;
        }
        me.createBufferSource();
        me.bufferSourceNode.start(0, time);

        me.currentTime = time;
        // console.log('play at time ' + time);
        me.timeupdate();

        NS.lyric.refresh();
        return me;
    },


    stop: function() {
        var me = this;
        if (me.STOPPED) { return me; }
        if (me.states.createBufferSource) {

            NS.dom.viewDisk.node.turnOff();

            me.STOPPED = true;
            me.currentTime = me.duration;
            me.timeOffset = me.context.currentTime;
            cancelAnimationFrame( me.__timer );
            me.__TIMEUPDATE = false;

            me.output.disconnect();
            me.bufferSourceNode.stop(0);
        }
        return me;
    },


    pause: function() {
        var me = this;
        if (me.PAUSED || me.STOPPED) { return me; }
        NS.dom.viewDisk.node.turnOff();

        me.output.disconnect(NS.audio.headGain);
        me.PAUSED = true;

        cancelAnimationFrame( me.__timer );
        me.__TIMEUPDATE = false;

        return me;
    },


    timeupdate: function() {
        var me = this;

        if ( me.__TIMEUPDATE ) { return me; } // already updating

        me.timeOffset = me.context.currentTime - me.currentTime;
        // console.log('currentTime: ' + me.currentTime);
        var audioContextTimeupdate = function() {
            if ( (me.context.currentTime - me.timeOffset) > me.duration ) {
                cancelAnimationFrame( me.__timer );
                me.__TIMEUPDATE = false;

                return me;
            }

            me.currentTime = me.context.currentTime - me.timeOffset;

            // plan A: making a 'timeupdate' event on AudioContext
            me.context.dispatchEvent(new Event('timeupdate'), {
                'bubbles': true,
                'defaultPrevented': false,
                'isTrusted': true,
                'target': me,
                'originalTarget': me,
                'srcElement': me,
                'timeStamp': + new Date()
            });

            // plan B
            // _.each(me.onTimeupdate, function(fn) {
            //     fn( me.currentTime );
            // });
            me.__timer = requestAnimationFrame( audioContextTimeupdate );
            me.__TIMEUPDATE = true;
        };
        audioContextTimeupdate();
    },


    toString: function() { return '[object Song]'},
};


module.exports = function( ctx ) {
    return Song;
};
