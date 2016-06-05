// contains all GLOBAL objects, do not exposed directly to window
(function(w) {
    w.NS = {};
    // add anything you like under NS.something
    //==> declare at the beginning of this file,
    //==> add to NS at the bottom
    var LocalFileList = function() {

        // FileContainer will store the true data
        var FileContainer = function() {
            this._array = [];
            return this;
        };
        FileContainer.prototype = {
            add: function(str) { this._array.push(str); return this; },
            remove: function(str) {
                var a = this._array;
                this._array = _.filter(a, // remove those equal to str
                    function(value){ return value !== str; });
                return this;
            },
            length: function() { return this._array.length; }
        };

        // Index Tree store all file related message and index to each subtree
        var IndexTree = function() {
            // name artist album
            this._tree = {};
            return this;
        };
        IndexTree.prototype = {
            add: function(file, group, index) {
                var name = file.name,
                    size = file.size,
                    tree = this._tree;

                if (tree[name] && tree[name].size === size) { // already load one: JH-bugs: sizes
                    dConsole.log("skip " + name + ": already had one.");

                    return false;
                }// already load one
                else if( tree[name] ) { // with different size, as a new object, name end with #i
                    // JH-bugs: here should count all file, that share a same name and compare their size
                    var num = tree[name].count;
                    if (typeof(num) === 'number') {
                        tree[ name + '#' + (++num)] = {
                            name: name,
                            num: num, // the number of this in those songs share the name
                            size: size,
                            group: group,
                            index: index
                        };
                        return true;
                    }
                    else { // this maybe the second one
                        num = 1;
                        tree[ name ].count = 2;
                        tree[ name ].num = num;
                        tree[ name + '#' + (++num)] = {
                            name: name,
                            num: num, // the number of this in those songs share the name
                            size: size,
                            group: group,
                            index: index
                        };
                        return true;
                    }
                } // different size
                else { // this is the first one on this name
                    tree[ name ] = {
                        name: name,
                        size: size,
                        group: group,
                        index: index
                    };
                    return true;
                }
            },
            set: function() {},
            get: function() {},
            remove: function() {},
        };
        this.audio =  new FileContainer();
        this.lyric =  new FileContainer();
        this.image =  new FileContainer();

        // this _tree records all
        this._treeTitle = {};
        this._treeArtist = {};
        this._treeAlbum = {};

        return this;
    };
    LocalFileList.prototype = {
        AUDIO : 0,
        LYRIC : 1,
        IMAGE : 2,

        add: function(file, type) {
            switch ( type ) {
                case this.AUDIO:
                    this.audio.add(file);
                    var index = this.audio.length - 1;
                    break;
                case this.LYRIC:
                    this.lyric.add(file);
                    var index = this.audio.length - 1;
                    break;
                case this.IMAGE:
                    this.image.add(file);
                    var index = this.audio.length - 1;
                    break;
                default:

            }
        }
    };


    // desktop browsers don't support touch events
    var mobileOrDestop = function() {
        return null === document.ontouchend;
    };
    // another way: not completed
    var mobileOrDestop1 = function() {
        var ug = navigator.userAgent;
        var result = ug.search(/windows|x11|Mac.*(^iphone)/ig);
        dConsole.log(result === -1? 'Use input[type=file] to add files' : 'Drag&Drop files onto me!');
        // return true if userAgent fulfill desktop-browser conditions
        //   and browser support AudioContext() [webkitAudioContext() included]
        return NS.supports.audioContext && result !== -1;
    };


    // AudioContext
    var supportAudioContext = function() { return !!window.AudioContext; };
    // this contains Song(), SongList()
    // create
    var audioCtx = function() { // Global NameSpace AudioContext Initial
        if (!supportAudioContext()) {
            // alert("WoW! your browser doesn't support the tech: AudioContext.\n我的天！ 你的浏览器居然不支持音频解析，赶紧升级到最新版本!\n或者，你可以尝试用QQ浏览器, Firefox 或者 Chrome浏览器。\n要更好地体验黑科技，建议您使用电脑版的浏览器。");
            alert("WoW! your browser doesn't support the tech: AudioContext.\nFor more joy, please open this player in Destop Browsers.");
            // polyfill NS.audio.ctx...
            return false;
        }

        var ctx = new AudioContext();
        var currentPlayingSong = null;
        var headGain = ctx.createGain(); // this gain works as the headoffice to control all volume of inputs
            headGain.connect(ctx.destination);

        // this works as Center controller
        var controller = {
            play: function() {
                var currentPlayingSong = NS.audio.currentPlayingSong;
                if (currentPlayingSong.paused) {
                    currentPlayingSong.play();
                }
                return currentPlayingSong;
            },
            pause: function() {
                var currentPlayingSong = NS.audio.currentPlayingSong;

                NS.audio.currentPlayingSong.pause();
                return currentPlayingSong;
            },
            next: function() {},
            stop: function() {},
            mute: function() {
                headGain.gain.value = 0;
            },
            songEnd: function(song) {
                NS.audio.songList.playNext();
            },
        };

        // Song wrapper for each song

        // "I think maybe I just quit and go back home to make noodles."
        // I think this gay works like a Promise
        var Song = function Song( file ) {
            if (this === window) { return new Song( file ); }

            this._Steps = {
                '0_uninit':true,
                '1_init':false,
                '2_readFile':false,
                '3_decode':false,
                '4_sourceBuffer':false
            };

            this.context = ctx;
            this._NextToDo = ['init', 'readFile', 'decode', 'createBufferSource'];
            this._targetStep = '0_uninit';
            this._currentStep = '0_uninit';
            this._state = 'DONE'; // 'DONE'/'ING'

            // 1_init
            this._file = null;
            this.fileName = this.size = this.type = null; // messages from File
            // extra: message after analyse fileName
            this.title = this.artist = null;
            // 2_getBuffer
            this._buffer = null;
            // 3_decode
            this._audioBuffer = null;
            // 4_sourceBuffer
            this.output = this.sourceBufferNode = this.gainNode = null;
            this.duration = null; // message after audio decode
            // for state after play
            this.paused = false;
            this.stopped = false;

            // playing state
            this.currentTime = 0; // like audio
            this.timeOffset = 0;  // offset between audio.currentTime and ctx.currentTime
            this.__timer = null;  // for requestAnimationFrame to store ID
            this.onTimeupdate = []; // functions that invoke when timeupdate
            this.__TIMEUPDATE = false;

            // if get argument file
            if (file && file.toString() === '[object File]') { this.init( file ); }

            return this;
        };
        Song.prototype = {
            init: function InitwithAudioFileBuffer( file ) {
                var me = this;
                if (!file || file.toString() !== '[object File]') {
                    throw new Error('Song.init() receive something but file.');
                }
                else {
                    me._file = file;
                    me._Steps['1_init'] = true;
                    me._NextToDo.shift();

                    me.fileName = file.name;
                    me.size = file.size;
                    me.type = file.type;

                    // analyseFilename for SongList update information
                    me.analyseFilename();

                    // overwrite init function
                    me.init = function() {
                        console.error('Each Song can only init once.');
                        return me;
                    };
                }
            },
            analyseFilename: function() {
                var me = this;

                // main works
                // get rid of subfix
                var name = this.fileName.substring(0, me.fileName.lastIndexOf('.') );
                // JH-bugs: what if fileName not obey standard 'ARTIST-TITLE'
                if (name.search('-') === -1) {
                    console.warn('Song: Not a Regular Filename.');
                    me.title = name;
                    return me;
                }
                var result = name.split('-');
                me.artist = result[0].trim(); result.shift();
                me.title = result.length === 1? result[0].trim(): result.join('-').trim();

                return me;
            },
            //Notes: readFile is an asynchronous function
            readFile: function GetFileUsingFileReader( callback ) { // asynchronous function
                var me = this;

                // main work
                me._state = 'ING';

                var fr = new FileReader();
                fr.readAsArrayBuffer( me._file );
                // console.log(fr + 'readAsArrayBuffer');
                fr.onload = function(e) {
                    me._buffer = fr.result;
                    me._Steps['2_readFile'] = true;
                    me._NextToDo.shift();
                    console.log('file loaded.');

                    me._state = 'DONE'
                    callback();
                    // me.next();
                };
                fr.onerror = function(e) {
                    console.error('Song load buffer ERROR:');
                    console.log(e);
                    me._state = 'DONE';
                };
                return me;
            },
            //Notes: decode is an asynchronous function
            decode: function DecodeAudioData( callback ) { // asynchronous function
                var me = this;

                // main work
                me._state = 'ING';
                // decode using AudioContext
                ctx.decodeAudioData(me._buffer, function( audioBuffer ) {
                    me._audioBuffer = audioBuffer;
                    me._Steps['3_decode'] = true;
                    me._NextToDo.shift();

                    me._state = 'DONE';
                    callback();
                    // me.next();
                });
                return me;
            },
            createBufferSource: function CreateBufferSourceNode( callback ) { // if you want to play one more time
                var me = this;

                // main works
                var bs = ctx.createBufferSource();

                bs.onended = function(e) {
                    me.stopped = true;
                    controller.songEnd( me ); // callback with song
                    console.log('songEnd: ' + me.title);
                };

                // JH-bugs: what if this._audioBuffer is not set
                bs.buffer = me._audioBuffer;
                if(me.sourceBufferNode) {
                    me.sourceBufferNode.disconnect();
                }
                me.sourceBufferNode = bs;
                me.currentTime = 0;
                me.timeOffset = 0;
                cancelAnimationFrame( me.__timer );
                me.__TIMEUPDATE = false;

                // console.log('new sourceBufferNode created.');

                if (me.gainNode) { // if there is a gainNode, connect to it
                    bs.connect(me.gainNode);
                }
                else { // otherwise, set sourceBufferNode to me.output
                    me.output = bs;
                }

                me._Steps['4_sourceBuffer'] = true;

                if (_.isFunction(callback)) {
                    callback( me.sourceBufferNode );
                }
                return me;
            },
            getDuration: function GetSongDuration() {
                var me = this;

                me.duration = me._audioBuffer.duration;
                return me.duration;
            },
            createGain: function createGain( createNewGain ) {
                var me = this;

                // if can't get one, create one
                if (!me.gainNode) {
                    me.gainNode = ctx.createGain();
                }

                me.sourceBufferNode.connect(me.gainNode);
                    me.output = me.gainNode;

                return me;
            },
            connect: function ConnectSongToAudioContext( anotherAudioContextNode ) {
                var me = this;
                // if ( me._targetStep < '4_sourceBuffer' ) {
                //     me._NextToDo.push('connect');
                //     me.until('4_sourceBuffer');
                //     return me;
                // }
                me.readFile(function() {
                    me.decode(function() {
                        me.createBufferSource();
                        me.getDuration();
                        me.createGain();

                        if (anotherAudioContextNode && anotherAudioContextNode.disconnect) {
                            me.output.connect( anotherAudioContextNode );
                        } else {
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

                try {
                    // play one song only
                    if (lastone && lastone !== me) { lastone.stop(); }

                    // when audio had been paused
                    if (me.paused) { // if play after pause, just connect to headGain
                        me.output.connect(NS.audio.headGain);

                        tagTotalTime.innerHTML = format( me.duration );

                        me.timeupdate();

                        me.paused = false;
                        me.stopped = false;
                        return me;
                    }

                    // when audio had been stop
                    if (me.stopped) { // create newe buffersource if me had been stop
                        me.createBufferSource(function() {
                            me.stopped = false;
                            me.paused = false;
                            me.play();
                            me.getDuration();
                            tagTotalTime.innerHTML = format( me.duration );

                            me.currentTime = 0;
                            me.timeupdate();
                        });
                        return me;
                    }

                    NS.audio.currentPlayingSong = me;
                    if (me._Steps['4_sourceBuffer']) {
                        // play if sourceBufferNode was never been played
                        me.createGain();
                        me.output.connect(NS.audio.headGain);

                        me.sourceBufferNode.start(0);
                        me.getDuration();
                        tagTotalTime.innerHTML = format( me.duration );

                        me.currentTime = 0;
                        me.timeupdate();
                    }
                    else {
                        // use connect to handle all asynchronous functions
                        me.connect( function() {
                            me.sourceBufferNode.start(0);
                            me.getDuration();
                            tagTotalTime.innerHTML = format( me.duration );

                            me.currentTime = 0;
                            me.timeupdate();
                        });
                    }

                }
                catch(e) { // sourceBufferNode is already play
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
                me.sourceBufferNode.start(0, time);

                me.currentTime = time;
                // console.log('play at time ' + time);
                me.timeupdate();

                return me;
            },
            stop: function() {
                var me = this;
                if (me.stopped) { return me; }
                if (me._Steps['4_sourceBuffer']) {

                    NS.dom.viewDisk.node.turnOff();

                    me.stopped = true;
                    me.currentTime = me.duration;
                    me.timeOffset = me.context.currentTime;
                    cancelAnimationFrame( me.__timer );
                    me.__TIMEUPDATE = false;

                    me.output.disconnect();
                    me.sourceBufferNode.stop(0);
                }
                return me;
            },
            pause: function() {
                var me = this;
                if (me.paused || me.stopped) { return me; }
                NS.dom.viewDisk.node.turnOff();

                me.output.disconnect(NS.audio.headGain);
                me.paused = true;

                cancelAnimationFrame( me.__timer );
                me.__TIMEUPDATE = false;

                return me;
            },
            timeupdate: function() {
                var me = this;

                if ( (me.context.currentTime - me.timeOffset) > me.duration ) {
                    cancelAnimationFrame( me.__timer );
                    me.__TIMEUPDATE = false;

                    return me;
                }
                if ( me.__TIMEUPDATE ) { return false; } // already updating

                me.timeOffset = me.context.currentTime - me.currentTime;
                // console.log('currentTime: ' + me.currentTime);
                var audioContextTimeupdate = function() {
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
            check: function check() {
                var steps = this._Steps;
                for (var step in steps) {
                    if (!steps[step]) { return step; }
                }
                return step; // all done
            },
            toString: function() { return '[object Song]'},
            constructor: Song
        };

        // extendable songList
        var SongList = function() {
            var songlist = [];

            songlist.pre = 0;
            songlist.next = 1; // index for next one
            songlist.playing = 0; // index for current playing or paused songList

            songlist.MODES = ['LOOP', 'REPEATONE', 'SHUFFLE'];

            var _mode = 'LOOP';
            // mode for playlist 'LOOP' 'REPEATONE' 'SHUFFLE'
            Object.defineProperty(songlist, 'mode', {
                get: function(){return _mode;},
                set: function(mode){
                    var InModes = false;
                    songlist.MODES.forEach(function(value){
                        if (mode === value) {
                            InModes = true;
                            _mode = value;
                        }
                    });
                    if (!InModes) console.warn('Wrong value applied.');
                    return songlist;
                }
            });

            songlist.push = function(){
                var args = Array.prototype.slice.apply(arguments);
                args.forEach(function(value) {
                    if ( value.toString() === '[object Song]' && value._state > '0_uninit' ) {
                        Array.prototype.push.call(songlist, value);
                        value.analyseFilename();

                        // callback functions when update
                        if (typeof(songlist.output) === 'function') {
                            songlist.output( songlist.titles() );
                        }

                        return songlist;
                    }
                    console.warn('You\'re trying to push a object not Song instance or uninit Song to SongList');
                    return songlist;
                });
            };
            songlist.titles = function( itemCount ) {
                var songTitles = [];
                songlist.forEach(function(song) {
                    songTitles.push( song.title ); // every Song will invoke Song.analyseFilename() before push into SongList
                });
                return songTitles;//.splice(0, itemCount > 0? itemCount: undefined);
            };
            songlist.output = function() {};
            songlist.play = function( index ) {
                if (_.isNumber(+index) && +index < songlist.length) {
                    songlist[index].play(0);
                    songlist.playing = index;
                    songlist.next = (index + 1) >= songlist.length? 0: (index+1);
                    songlist.pre = (index - 1) < 0? (songlist.length - 1): (index - 1);
                } else {
                    var index = 0;
                    songlist[index].play(0);
                    songlist.playing = index;
                    songlist.next = (index + 1) >= songlist.length? 0: (index+1);
                    songlist.pre = (index - 1) < 0? (songlist.length - 1): (index - 1);
                }
            };
            songlist.playNext = function() {
                // JH-todo: songlist should has a modes and playNext should add supports to that
                songlist.play(songlist.next);
            };
            songlist.playPre = function() {
                songlist.play( songlist.pre );
            };
            return songlist;
        };
        var songList = new SongList();

        return {
            Song: Song, // Song creator function
            SongList: SongList, // SongList creator function

            ctx: ctx,
            headGain: headGain,
            songList: songList,
            currentPlayingSong: currentPlayingSong,
            controller: controller,
        }
    }


    // FullScreen
    var supportFullScreen = (function(docElem) {
        var fullscreen = cancelFullscreen = null;
        var fsWays = ['requestFullScreen', 'mozRequestFullScreen', 'webkitRequestFullScreen'],
            cfsWays = ['cancelFullscreen', 'mozCancelFullScreen', 'webkitCancelFullScreen'];
        var requestFullScreen = function( elem ) {
            for (var index = 0; index < fsWays.length; index++) {
                if (docElem[ fsWays[index] ]) {
                    fullscreen = fsWays[index]; break;
                }
            }
            if (!fullscreen) { return false; }
            return elem[fullscreen]();
        };
        var cancelFullScreen = function() {
            for (var index = 0; index < cfsWays.length; index++) {
                if (document[ cfsWays[index] ]) {
                    cancelFullscreen = cfsWays[index]; break;
                }
            }
            return document[cancelFullscreen]();
        }
        return {
            requestFullScreen: requestFullScreen,
            cancelFullScreen:  cancelFullScreen
        };
    })(document.documentElement);

    // transform time format from 100 to 01:40
    var formatTimestamp = function formatTimestamp(time) {
        // current time show like 01:01 under the play&pause button
    	var timeS = {}; // n: now; s: second; m: minute;
    	timeS.n = parseInt(time);
    	timeS.s = timeS.n % 60;
    	timeS.m = parseInt(timeS.n / 60);

    	return ("00" + timeS.m).substr(-2) + ":" + ("00" + timeS.s).substr(-2);
    };

    // Lyric File
    var Lyric = function Lyric( file ) {
        if (this === window) { return new Lyric( file ); }
        var me = this;

        me._file = me._buffer = null;
        me.fileName = me.size = me.type = null; // messages from File
        me.title = me.artist = null;

        // if get argument file
        if (file && file.toString() === '[object File]') { me.init( file ); }

        return me;
    };
    Lyric.prototype = {
        init: function( file ) {
            var me = this;

            if (!file || file.toString() !== '[object File]') {
                throw new Error('Song.init() receive something but file.');
            }
            else {
                me._file = file;

                me.fileName = file.name;
                me.size = file.size;
                me.type = file.type;

                // analyseFilename for SongList update information
                me.analyseFilename();

                // overwrite init function
                me.init = function() {
                    console.error('Each Song can only init once.');
                    return me;
                };
            }
        },
        analyseFilename: function() {
            var me = this;

            // main works
            // get rid of subfix
            var name = this.fileName.substring(0, me.fileName.lastIndexOf('.') );
            // JH-bugs: what if fileName not obey standard 'ARTIST-TITLE'
            if (name.search('-') === -1) {
                console.warn('Song: Not a Regular Filename.');
                me.title = name;
                return me;
            }
            var result = name.split('-');
            me.artist = result[0].trim(); result.shift();
            me.title = result.length === 1? result[0].trim(): result.join('-').trim();

            return me;
        },

        //Notes: readFile is an asynchronous function
        readFile: function GetFileUsingFileReader( callback, DOMEncoding ) { // asynchronous function
            var me = this;

            var fr = new FileReader();
            fr.readAsText(me._file, DOMEncoding || 'GB2312');

            fr.onload = function(e) { me._buffer = fr.result; callback(); };
            fr.onerror = function(e) { console.error('Song load buffer ERROR:'); dConsole.error(e); };
            return me;
        },

        // notice: file encoding:
        // utf-8
        // ANSI
        // UCS2 BigEndian
        //      LittleEndian
        decode: function() {
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
                    return str.replace('\n', '');
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
                        lyrics.push( arr[i] );
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

            if (!me._buffer) {
                me.readFile( function(){ me[0] = classifyLyric( splitLyricString(me._buffer) ); } );
                return me;
            }
            me[0] = classifyLyric( splitLyricString(me._buffer) );
            return me;
        },
    }


    // Binding to NS
    // adding to w.NS;
    var ns = w.NS;
    ns.localfilelist = new LocalFileList();
    ns.stackShowup = []; // divide into 2 or 3 level
    ns.stackShowup.releaseAll = function() {
        while (ns.stackShowup.length) {
            ns.stackShowup.pop()();
        }
    };

    ns.supports = {};
    ns.supports.audioContext = supportAudioContext();
    ns.supports.mobile = mobileOrDestop();
    ns.supports.fullscreen = supportFullScreen; // call requestFullScreen/cancelFullScreen

    ns.audio = audioCtx();
    ns.lyric = {
        Lyric: Lyric,
        list: {}
    }
    ns.util = {
        formatTimestamp: formatTimestamp,
    };
})(window);

// initial global parameters
(function(w) {
    // for mobile browser debug
    var elem = $dom('div#dConsole');
	document.body.appendChild(elem);
	w.dConsole = new DebugConsole(elem);

    // for loaded lrc
    w.loadedLRClist = [];
})(window);
