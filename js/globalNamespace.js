// contains all GLOBAL objects, do not exposed directly to window
(function(w) {
    w.NS = {};
    // add anything you like under NS.something
    //==> declare at the beginning of this file,
    //==> add to NS at the bottom

    //utils: transform time format from 100 to 01:40
    var formatTimestamp = function formatTimestamp(time) {
        // current time show like 01:01 under the play&pause button
    	var timeS = {}; // n: now; s: second; m: minute;
    	timeS.n = parseInt(time);
    	timeS.s = timeS.n % 60;
    	timeS.m = parseInt(timeS.n / 60);

    	return ("00" + timeS.m).substr(-2) + ":" + ("00" + timeS.s).substr(-2);
    };
    //utils: preloadImage
    var preloadImage = function( urlArray, loadedCallback ) {
        if (!_.isArray(urlArray)) { return false; }

        var startTime = +new Date(), success = [], fail = [];
        var process = function(index) {
            if (index === urlArray.length - 1) {
                dConsole.log('Images loaded: success x ' + success.length + "|| fail x " + fail.length);

                loadedCallback && loadedCallback();
            }
        };
        _.each( urlArray ,function(url, index) {
            var i = new Image();
            i.src = url;
            i.onload = function() {
                success.push({
                    url: url,
                    time: +new Date()
                });
                process(index);
            };
            i.onerror = function(e) {
                fail.push({
                    url: url,
                    time: +new Date()
                });
            };
        });
    };
    //utils: test if file isFile
    var isFile = function( file ) { return !!(file.size && file.toString && file.toString() === '[object File]'); };
    //utils: compare file
    var isOneFile = function( fileA, fileB ) {
        if (isFile(fileA) && isFile(fileB)) {
            if (fileA.size === fileB.size && fileA.name === fileB.name) {
                return true;
            }
        }

        return false;
    };


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
                NS.audio.songlist.playNext();
            },
        };

        // Song wrapper for each song

        // "I think maybe I just quit and go back home to make noodles."
        // I think this gay works like a Promise
        var Song = function Song( file ) {
            if (this === window) { return new Song( file ); }

            this.constructor = Song;

            this._Steps = {
                '0_uninit':true,
                '1_init':false,
                '2_readFile':false,
                '3_decode':false,
                '4_sourceBuffer':false
            };

            this.context = ctx;
            this._NextToDo = ['init', 'readFile', 'decode', 'createBufferSource'];
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
            if ( isFile(file) ) { this.init( file ); }

            return this;
        };
        Song.prototype = {
            init: function InitwithAudioFileBuffer( file ) {
                var me = this;
                if (!isFile(file)) {
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
                NS.lyric.lookup( me.title );

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
            check: function check() {
                var steps = this._Steps;
                for (var step in steps) {
                    if (!steps[step]) { return step; }
                }
                return step; // all done
            },
            toString: function() { return '[object Song]'},
        };
        var isSong = function( song ) {
            return song && song.constructor && song.constructor === Song;
        }
        // extendable songlist
        var SongList = function() {
            var songlist = [];

            songlist.pre = 0;
            songlist.next = 1; // index for next one
            songlist.playing = 0; // index for current playing or paused songlist

            // bind songlist to #btn-playMode to change songlist.mode when button is clicked
            songlist.init = function init( target ) {
                target = $.isDOMElement(target)? target : $('#btn-playMode');
                var me = songlist;

                $on(target, 'playmodechange', function() {
                    me.mode = target.node.mode;
                });

                return songlist;
            }

            songlist.MODES = ['LOOP', 'REPEATONE', 'SHUFFLE'];
            // private data set for songlist.mode
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

            songlist.push = function(){ // overwrite native Array.push to fulfill testing
                var args = Array.prototype.slice.apply(arguments);
                args.forEach(function(value) {
                    if ( isSong(value) && value._state > '0_uninit' ) {
                        Array.prototype.push.call(songlist, value);
                        value.analyseFilename();

                        // callback functions when update
                        if (typeof(songlist.output) === 'function') {
                            songlist.output( songlist.message() );
                        }

                        return songlist;
                    }
                    console.warn('You\'re trying to push a object not Song instance or uninit Song to SongList');
                    return songlist;
                });
            };
            songlist.output = function() {};

            songlist.message = function( itemCount ) {
                var songMessage = [];
                songlist.forEach(function(song) {
                    songMessage.push( {
                        title: song.title,
                        artist: song.artist
                    }); // every Song will invoke Song.analyseFilename() before push into SongList
                });
                return songMessage;//.splice(0, itemCount > 0? itemCount: undefined);
            };

            // private function to generate next song index by songlist.mode
            var _whichIsNext = function() { // generate next song index
                var me = songlist,
                    mode = me.mode;
                switch (mode) {
                    case 'LOOP':

                        break;
                    case 'SHUFFLE':

                        break;
                    case 'REPEATONE':

                        break;
                    default:

                }
            };

            songlist.play = function( index ) {
                var index = +index;
                if (_.isNumber(index) && index < songlist.length) {
                    songlist[index].play(0);
                    songlist.playing = index;
                    songlist.next = (index + 1) >= songlist.length? 0: (index + 1);
                    songlist.pre = (index - 1) < 0? (songlist.length - 1): (index - 1);
                }
                else {
                    var index = 0;
                    songlist[index].play(0);
                    songlist.playing = index;
                    songlist.next = (index + 1) >= songlist.length? 0: (index + 1);
                    songlist.pre = (index - 1) < 0? (songlist.length - 1): (index - 1);
                }
            };
            songlist.playNext = function() {
                // JH-todo: songlist should has a modes and playNext should add supports to that
                songlist.play(songlist.next); };
            songlist.playPre = function() { songlist.play( songlist.pre ); };
            return songlist;
        };
        var songlist = new SongList();

        return {
            Song: Song, // Song creator function
            SongList: SongList, // SongList creator function

            ctx: ctx,
            headGain: headGain,
            songlist: songlist,
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

    // Lyric File
    var Lyric = function Lyric( file ) {
        if (this === window) { return new Lyric( file ); }
        var me = this;

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

        // if get argument file
        if ( isFile(file) ) { me.init( file ); }

        return me;
    };
    Lyric.prototype = {
        init: function( file ) {
            var me = this;

            if (!isFile(file)) {
                throw new Error('Song.init() receive something but file.');
            }
            else {
                me._file = file;

                me.fileName = file.name;
                me.size = file.size;
                me.type = file.type;

                me.states.init = true;

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
                console.warn('Lyric: Not a Regular Filename.');
                me.title = name;
                return me;
            }
            var result = name.split('-');
            me.artist = result[0].trim(); result.shift();
            me.title = result.length === 1? result[0].trim(): result.join('-').trim();

            me.states.analyseFilename = true;

            return me;
        },

        //Notes: readFile is an asynchronous function
        readFile: function GetFileUsingFileReader( callback, DOMEncoding ) { // asynchronous function
            var me = this;

            // already read
            if ( me.states.readFile ) { callback && callback(); return me; }

            var fr = new FileReader();
            fr.readAsText(me._file, DOMEncoding || 'GB2312');

            fr.onload = function(e) { me._buffer = fr.result; me.states.readFile = true; callback(); };
            fr.onerror = function(e) { console.error('Song load buffer ERROR:'); dConsole.error(e); };
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
                me.readFile( function(){ me[0] = classifyLyric( splitLyricString(me._buffer) ); callback&&callback(); } );
                return me;
            }
            me[0] = classifyLyric( splitLyricString(me._buffer) );

            me.states.decode = true;

            callback&&callback();
            return me;
        },
        generate: function() {
            var me = this;
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
        }
    }
    var isLyric = function( lyric ) {
        return lyric && lyric.constructor && lyric.constructor === Lyric;
    };

    // Image File : album covers
    var AlbumCover = function( file ) {
        if (this === window) { return new AlbumCover( file ); }
        var me = this;

        me.constructor = AlbumCover;

        me._file = me._buffer = null;
        me.fileName = me.size = me.type = null; // messages from File
        me.title = me.artist = null;

        me.states = {
            init: false,
            analyseFilename: false,
            readFile: false
        };

        // if get argument file
        if ( isFile(file) ) { me.init( file ); }

        return me;
    };
    AlbumCover.prototype = {
        init: function( file ) {
            var me = this;

            if (!isFile(file)) { throw new Error('Song.init() receive something but file.'); }
            else {
                me._file = file;

                me.fileName = file.name;
                me.size = file.size;
                me.type = file.type;

                me.states.init = true;

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

            if ( me.states.readFile ) { callback && callback(); return me; }

            var fr = new FileReader();
            fr.readAsDataURL(me._file);

            fr.onload = function(e) { me._buffer = fr.result; me.states.readFile = true; callback(); };
            fr.onerror = function(e) { console.error('Song load buffer ERROR:'); dConsole.error(e); };
            return me;
        },
        setBackgroundTo: function setBackgroundTo( target ) {
            if(!$.isDOMElement(target)) { return false; }
            var me = this;

            target.style.backgroundImage = 'url(' + me._buffer + ")";
        },
    }
    var isCover = function( cover ) {
        return cover && cover.constructor && cover.constructor === AlbumCover;
    };

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
        list: {},
        push: function( lyric ) {
            var me = ns.lyric,
                list = me.list;

            if ( !isLyric(lyric) ) { return false; }

            var fileOneTitle = list[ lyric.title ];
            if (_.isArray( fileOneTitle )) {

                for (var i = 0; i < fileOneTitle.length; i++) {

                    if (isOneFile(l, lyric)) { return true; }
                }

                // no same file
                fileOneTitle.push(lyric);
            }
            if (fileOneTitle) {
                // same file
                if ( isOneFile(fileOneTitle, lyric)) { return true; }
                // same title but different files
                list[ lyric.title ] = [ fileOneTitle, lyric ];
            }

            list[ lyric.title ] = lyric;
        },
        currentLyric: null,
        currentView: null,
        bindLyric: function( lyric, callback ) {
            var me = ns.lyric;

            me.currentLyric = lyric;
            if (!lyric.states.decode) {
                lyric.decode(function() {
                    callback&&callback();
                });
            } else {
                callback&&callback();
            }
        },
        bindView: function( view, lyric ){
            if (!$.isDOMElement(view) ) { return false; }
            var me = ns.lyric;

            var ul = $(view, 'ul');
            if (!ul) { ul = $dom('ul'); view.appendChild(ul); }

            me.currentView = view;

            // JH-bugs: what if lyric is not lyric.states.decode ?
            if ( _.isObject(me.currentLyric) ) {
                var linesLyric = me.currentLyric.generate();
                ul.innerHTML = linesLyric;
            }
            else if ( _.isObject( lyric ) ) {
                var linesLyric = lyric.generate();
                ul.innerHTML = linesLyric;
            }
        },
        __lastListener: null,
        start: function( lyric ) {
            var me = ns.lyric;

            // ensure lyric is decoded.
            if (!lyric.states.decode) {
                lyric.decode(function() {
                    me.start( lyric );
                });
                return me;
            }

            $off(NS.audio.ctx, 'timeupdate', me.__lastListener);

            // setup for scroll lyrics
            var offsetTop = "";
            var lyricHightlightOriginTop = 160;
            var OFFSET = 0; // for lyric to show earlier

            me.bindLyric(lyric, function() {
                me.bindView($('#view-lyric'));
            });

            var lrc = lyric[0];
            var timetags = lrc.timeTags;
            var lyricsList = lrc.lyrics;

            var ul = $(me.currentView, 'ul');

            me.__lastListener = function() {
                var song = NS.audio.currentPlayingSong;

                var curTime = song.currentTime + OFFSET;

                    // auto scroll lyrics
            	for (var i=0; i<timetags.length; i++) {
                    // find the index of next line of lyrics: i
            		if (curTime <= timetags[i]) {
            			var arrlyricsList = lrc[ timetags[i-1] ] || []; // get lyric array by lrc[time]

            			var LIs = ul.childNodes;

                        // scroll the lyrics as audio play
            			if (i - 2 >= 0) {
            				LIs[i - 1].className = "line focus";
            				LIs[i - 2].className = "line";
            				ul.style.top = lyricHightlightOriginTop -(LIs[i - 1].offsetTop) + "px";
            			}
                        else if (i >= 1) {
            				LIs[i - 1].className = "line focus";
            				ul.style.top = lyricHightlightOriginTop -(LIs[i - 1].offsetTop) + "px";
            			}


            			var strLrcTMP = "";
            			// JH-bugs: multi-line what?
            			for (var j=0; j < arrlyricsList.length; j++) {
            				strLrcTMP += lyricsList[ arrlyricsList[j] ];
            			}

            			return strLrcTMP;
            		}
            	}
            };

            $on(NS.audio.ctx, 'timeupdate', me.__lastListener);
        },
        lookup: function( title ) {
            var me = ns.lyric;
            if (me.list[ title ]) {
                me.start( me.list[ title ] );
            }
        }
    };
    ns.album = {
        AlbumCover: AlbumCover,
        list: {},
        push: function( cover ) {
            var me = ns.album,
                list = me.list;

            if ( !isCover(cover) ) { return false; }

            var fileOneTitle = list[ cover.title ];
            if (_.isArray( fileOneTitle )) {

                for (var i = 0; i < fileOneTitle.length; i++) {

                    if (isOneFile(l, cover)) { return true; }
                }

                // no same file
                fileOneTitle.push(cover);
            }
            if (fileOneTitle) {
                // same file
                if ( isOneFile(fileOneTitle, cover)) { return true; }
                // same title but different files
                list[ cover.title ] = [ fileOneTitle, cover ];
            }

            list[ cover.title ] = cover;
        },
        lookup: function( title ) {
            var me = ns.album;
            if (me.list[ title ]) {
                me.start( me.list[ title ] );
            }
        },
        start: function( cover ) {
            cover.readFile(function(){ cover.setBackgroundTo( $('#page-main')); });
        },
    };
    ns.util = {
        formatTimestamp: formatTimestamp,
        preloadImage:    preloadImage,
        isFile:          isFile,
        isOneFile:       isOneFile,
        isLyric:         isLyric,
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
