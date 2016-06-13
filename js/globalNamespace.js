// contains all GLOBAL objects, do not exposed directly to window
(function(w) {
    w.NS = {};
    // add anything you like under NS.something
    //==> declare at the beginning of this file,
    //==> add to NS at the bottom

    //utils: transform time format from 100 to 01:40
    var formatTimestamp = function formatTimestamp(time) {
        // current time show like 01:01 under the play&pause button
    	var num = parseInt(time),
            sec = num % 60,
            min = parseInt( num / 60);
        var mtTwo = function(n) {
            return n < 0? '00':
                     n < 10? '0'+n: ''+n; }; // more than two digits

    	return mtTwo(min) + ":" + mtTwo(sec);
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
    var isFile = function( file ) { return !!(typeof(file) === 'object' && file.size >= 0 && file.toString && file.toString() === '[object File]'); };
    //utils: compare file
    var isOneFile = function( fileA, fileB ) {
        if (isFile(fileA) && isFile(fileB)) {
            if (fileA.size === fileB.size && fileA.name === fileB.name) {
                return true;
            }
        }

        return false;
    };


    // desktop browsers don't support touch events
    var mobileOrDestop = function() { return null === document.ontouchend; };
    // another way: not completed
    var mobileOrDestop1 = function() {
        var ug = navigator.userAgent;
        var result = ug.search(/windows|x11|Mac.*(^iphone)/ig);
        dConsole.log(result === -1? 'Use input[type=file] to add files' : 'Drag&Drop files onto me!');
        // return true if userAgent fulfill desktop-browser conditions
        //   and browser support AudioContext() [webkitAudioContext() included]
        return NS.supports.audioContext && result !== -1;
    };
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


    // AudioContext
    var supportAudioContext = function() {
        // JH-debuging make browser act like mobile one which support no AudioContext
        // return false;
        return !!window.AudioContext;
    };
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
                if (currentPlayingSong.PAUSED) {
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

                var fr = new FileReader();
                fr.readAsArrayBuffer( me._file );
                fr.onload = function(e) {
                    me._buffer = fr.result;
                    me.states.readFile = true;
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
                ctx.decodeAudioData(me._buffer, function( audioBuffer ) {
                    me._audioBuffer = audioBuffer;
                    me.states.decode = true;

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
        var isSong = function( song ) {
            return song && song.constructor && song.constructor === Song;
        }
        // extendable songlist
        var SongList = function() {
            var songlist = [];

            songlist.pre = 0;
            songlist.next = 1; // index for next one
            songlist.playing = 0; // index for current playing or PAUSED songlist

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
                    if ( isSong(value) && value.states.init ) {
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
    };

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
    }
    var isLyric = function( lyric ) {
        return lyric && lyric.constructor && lyric.constructor === Lyric;
    };

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
            if (_.isArray(target)) {
                _.each(target, function(item){ item.style.backgroundImage = 'url(' + me._buffer + ")"; });
            } else {
                target.style.backgroundImage = 'url(' + me._buffer + ")";
            }
            return me;
        },
    }
    var isCover = function( cover ) { return cover && cover.constructor && cover.constructor === AlbumCover; };

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
        defaults: {
            currentView: $('#view-lyric'),
        },
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
            if ( isLyric(me.currentLyric) ) {
                var linesLyric = me.currentLyric.generate();
                ul.innerHTML = linesLyric;
            }
            else if ( isLyric( lyric ) ) {
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
                    me.lookup( lyric.title ); // in case user change another song
                });
                return me;
            }

            $off(NS.audio.ctx, 'timeupdate', me.__lastListener);

            // setup for scroll lyrics
            var offsetTop = "";
            var lyricHightlightOriginTop = 160;
            var OFFSET = 0; // for lyric to show earlier

            me.bindLyric(lyric, function() {
                me.bindView( me.defaults.currentView );
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
        end: function() {
            var me = ns.lyric;
            $off(NS.audio.ctx, 'timeupdate', me.__lastListener);
            if (!me.currentView) { me.bindView(me.defaults.currentView); }

            var ul = $(me.currentView, 'ul');
            ul.innerHTML = '<span class="btn" style="color:rgba(255,255,255,0.6);" onclick="$(\'input[type=file]\').click();">Click option button to add a lyric file.</span>';
        },
        lookup: function( title ) {
            var me = ns.lyric;
            if (me.list[ title ]) { // match
                me.start( me.list[ title ] );
            }
            else { // no match
                me.end();
            }
        },
        refresh: function() {

        },
    };
    ns.album = {
        defaults: {
            toCover: [ $('#page-main') ].concat( $.toArray( $('.view-albumCover') ) ),
        },
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
        start: function( cover ){
            var me = ns.album;
            var elem = me.defaults.toCover;
            if (_.isArray( elem )) {
                cover.readFile(function(){
                    _.each(elem, function(item) {
                        cover.setBackgroundTo( item );
                    });
                });
            } else {
                cover.readFile(function(){ cover.setBackgroundTo( elem ); });
            }
        },
    };

    var Router = (function() {
        var Router = function() {
            var me = this;
            me.state = null;
            me.push = function( page ) {
                if (page === '' + page) {
                    history.pushState(page, null);
                    me.state = page;
                }
            };
            return me;
        };
        return new Router();
    }());
    var createStyle = (function(){
        var CreateStyleTag = function() {
            var me = this;

            me.tags = [];
            me.createTag = function( content ) {
                me.tags.push(content);
                return me;
            };
            me.insert = function() {
                var tag = document.createElement('style');
                tag.innerHTML = me.tags.join('');
                document.body.appendChild(tag);
                return me;
            };

            return me;
        };

        return new CreateStyleTag();
    }());

    ns.util = {
        formatTimestamp: formatTimestamp,
        preloadImage:    preloadImage,
        isFile:          isFile,
        isOneFile:       isOneFile,
        isLyric:         isLyric,
        router:          Router,
        createStyle:     createStyle,
    };
})(window);

// initial global parameters
(function(w) {
    // for mobile browser debug
    var elem = $dom('div#dConsole');
    $('#viewport').appendChild(elem);
	w.dConsole = new DebugConsole(elem);
})(window);
