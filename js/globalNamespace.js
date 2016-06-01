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
            play: function( inTime ) {
                var currentPlayingSong = NS.audio.currentPlayingSong;
                console.log('play in ' + inTime);
                if (currentPlayingSong.paused) {
                    currentPlayingSong.play();
                }
                return currentPlayingSong;
            },
            pause: function( inTime ) {
                var currentPlayingSong = NS.audio.currentPlayingSong;
                console.log('play in ' + inTime);
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

            // if get argument file
            if (file && file.toString() === '[object File]') { this.init( file ); }

            return this;
        };
        Song.prototype = {
            init: function InitwithAudioFileBuffer( file ) {
                var me = this;
                if (!file || file.toString() !== '[object File]') {
                    console.warn('you send a wrong file.');
                    return me;
                } else {
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
                me.next();
            },
            analyseFilename: function() {
                var me = this;
                // if ( me._targetStep < '1_init' ) {
                //     me._NextToDo.push('analyseFilename');
                //     me.until('1_init');
                //     return me;
                // }

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
                // if ( me._currentStep > '2_readFile' || me._state == 'ING' ) {
                //     console.log('me._currentStep');
                //     return me;
                // }
                // if ( me._targetStep < '2_readFile' ) {
                //     me.until('2_readFile');
                //     return me;
                // }
                // // already done
                // if ( me._buffer && me._buffer.toString() === '[object FileReader]') {
                //     console.log('already got one.');
                //     me.next();
                //     return me;
                // }

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
                // if ( me._currentStep > '3_decode' || me._state == 'ING') { return me; }
                // if ( me._targetStep < '3_decode' ) {
                //     me.until('3_decode');
                //     return me;
                // }

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
                // if ( me._currentStep > '4_sourceBuffer' || me._state == 'ING') { return me; }
                // if ( me._targetStep < '4_sourceBuffer' ) {
                //     me.until('4_sourceBuffer');
                //     return me;
                // }

                // main works
                var bs = ctx.createBufferSource();
                bs.onended = function(e) {
                    controller.songEnd( me ); // callback with song
                    console.log('songEnd: ' + me.title);
                };

                bs.buffer = this._audioBuffer;
                if(me.sourceBufferNode) {
                    me.sourceBufferNode.disconnect();
                }
                me.sourceBufferNode = bs;
                console.log('new sourceBufferNode created.');

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
                // after you get to decode
                // if ( me._targetStep < '3_decode' ) {
                //     me._NextToDo.push('getDuration');
                //     me.until('3_decode');
                //     return me;
                // }
                // if ( me._state == 'ING' ) {
                //     me._NextToDo.push('getDuration');
                //     return me;
                // }

                me.duration = me._audioBuffer.duration;
                return me.duration;
            },
            createGain: function createGain( createNewGain ) {
                var me = this;
                // create a new gain
                // if (createNewGain) {
                //     me.gainNode = ctx.createGain();
                //     me.sourceBufferNode.connect(me.gainNode);
                //     me.output = me.gainNode;
                //
                //     return me;
                // }

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

            play: function( inTime ) {
                var me = this;
                var inTime = _.isNumber(inTime)? inTime: 0;
                var lastone = NS.audio.currentPlayingSong;

                // view works
                NS.dom.viewDisk.node.turnOn();
                NS.dom.tagSongMessage.node.update( me.title, me.artist );

                try {
                    // play one song only
                    if (lastone && lastone !== me) {
                        lastone.stop();
                    }
                    // recover from stop or pause
                    if (me.paused) { // if play after pause, just connect to headGain
                        me.output.connect(NS.audio.headGain);
                        me.paused = false;
                        me.stopped = false;
                        return me;
                    }

                    if (me.stopped) { // create newe buffersource if me had been stop
                        me.createBufferSource(function() {
                            me.stopped = false;
                            me.paused = false;
                            me.play();
                        });
                        return me;
                    }

                    NS.audio.currentPlayingSong = me;
                    if (me._Steps['4_sourceBuffer']) {
                        // play if sourceBufferNode was never been played
                        me.createGain();
                        me.output.connect(NS.audio.headGain);
                        me.sourceBufferNode.start( inTime );
                    } else {
                        // use connect to handle all asynchronous functions
                        me.connect( function() {
                            me.sourceBufferNode.start(inTime);
                        });
                    }

                } catch(e) { // sourceBufferNode is already play
                    console.log(e);
                    me.output.disconnect();

                    me.createBufferSource(function(bufferSource) {
                        console.log('createBufferSource callback');
                        me.createGain();
                        me.play();
                        // me.output.connect(NS.audio.headGain);
                    });
                }
                return me;
            },
            stop: function( inTime ) {
                var me = this;
                if (me.stopped) { return me; }
                if (me._Steps['4_sourceBuffer']) {

                    NS.dom.viewDisk.node.turnOff();

                    me.stopped = true;
                    me.output.disconnect();
                    me.sourceBufferNode.stop( inTime );
                }
                return me;
            },
            pause: function( inTime ) {
                var me = this;
                if (me.paused || me.stopped) { return me; }
                NS.dom.viewDisk.node.turnOff();

                me.output.disconnect(NS.audio.headGain);
                me.paused = true;
                return me;
            },
            next: function next() {
                // var me = this;
                // console.log('coming to next again.');
                //
                // var current = me._currentStep,
                //     target = me._targetStep,
                //     todo = me._NextToDo,
                //     state = me._state;
                // // something processing: waiting for its call on next()
                // if (state === 'ING') {
                //     console.log('next: ING');
                //     return me;
                // }
                // // console.log(current);
                // // console.log(target);
                // // steps reach or beyond target step
                // if (current <= target) {
                //     if (todo.length) {
                //         var n = todo.shift();
                //         console.log(n + ' is the next to do.');
                //         me[n]();
                //     }
                // }
                // else { // find next step and go
                    // return me;
                // }
            },
            until: function nextUntil( step ) {
                // var me = this;
                //
                // var current = me._currentStep,
                //     target = me._targetStep,
                //     me = me,
                //     state = me._state;
                //
                // target = step>target? step: target;
                // if (state === 'DONE') {
                //     console.log('set target: DONE');
                //     me.next();
                // }
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
                }
            };
            songlist.playNext = function() {
                // JH-todo: songlist should has a modes and playNext should add supports to that
                songlist.play(songlist.next);
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
