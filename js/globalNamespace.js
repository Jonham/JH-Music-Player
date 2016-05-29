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


    // AudioContext
    var supportAudioContext = function() { return !!window.AudioContext; };
    var audioCtx = function() {
        if (!supportAudioContext()) {
            // alert("WoW! your browser doesn't support the tech: AudioContext.\n我的天！ 你的浏览器居然不支持音频解析，赶紧升级到最新版本!\n或者，你可以尝试用QQ浏览器, Firefox 或者 Chrome浏览器。\n要更好地体验黑科技，建议您使用电脑版的浏览器。");
            alert("WoW! your browser doesn't support the tech: AudioContext.\nFor more joy, please open this player in Destop Browsers.");
            return false;
        }

        var ctx = new AudioContext(),
            gain = ctx.createGain();
            gain.connect(ctx.destination);

        var controller = {
            play: function( inTime ) {},
            pause: function( inTime ) {},
            next: function() {},
            stop: function() {},
        };

        // Song wrapper for each song
        var Song = function( file ) {
            if (this === window) { return new Song( buffer, fileMsg ); }
                this._state = 'uninit';

                this._file = this._buffer = this._audioBuffer = null;
                // messages from File
                this.fileName = this.size = this.type = null;
                // message after analyse fileName
                this.title = this.artist = null;
                // message after audio decode
                this.duration = null;

            // if get arguments file
            if (file && file.toString() === '[object File]') {
                this.init( file );
            }

            return this;
        };
        Song.prototype = {
            init: function InitwithAudioFileBuffer( file ) {
                if (file && file.toString() === '[object File]') {
                    this._file = file;
                    this._state = 'init';

                    this.fileName = file.name;
                    this.size = file.size;
                    this.type = file.type;

                    return this;
                    // overwrite init function
                    this.init = function() {
                        console.error('Each Song can only init once.');
                        return 'ERROR: Each Song can only init once.';
                    };
                } else {
                    return 'you send a wrong file.';
                }
            },

            getBuffer: function GetFileUsingFileReader() {
                if (typeof(this._buffer) === 'object' && this._buffer.toString() === '[object FileReader]') {
                    return this._buffer;
                }
                if ( this._state === 'uninit') {
                    return 'your should Song.init( file ) first.';
                }

                var fr = new FileReader();
                fr.readAsArrayBuffer( this._file );
                fr.onload = function(e) {
                    this._buffer = fr.result;
                    this._state = 'getBuffer';
                };
                fr.onerror = function(e) {
                    console.error('Song load buffer ERROR:');
                    console.log(e);
                };

                return this;
            },
            decode: function() {
                // decode using AudioContext
            },
            analyseFilename: function() {},
            addSongMessage: function() {
                // this.duration
            },
            toString: function() { return '[object Song]'},
        };

        // extendable songList
        var SongList = function() {
            var l = [];
            l.next = -1; // index for next one

            l.MODES = ['LOOP', 'REPEATONE', 'SHUFFLE'];
            l.mode = 'LOOP'; // mode for playlist 'LOOP' 'REPEATONE' 'SHUFFLE'
            l.playing = -1; // index for current playing or paused songList

            return l;
        };
        var songList = new SongLIst();

        return {
            ctx: ctx,
            gain: gain,
            Song: Song,
            SongList: SongList,
            songList: songList,
            bufferSources: [],
            currentPlayingSong: [],
            controller: controller,
        }
    }

    // adding to w.NS;
    var ns = w.NS;
    ns.localfilelist = new LocalFileList();
    ns.stackShowup = [];
    ns.stackShowup.releaseAll = function() {
        while (ns.stackShowup.length) {
            ns.stackShowup.pop()();
        }
    };

    ns.supports = {};
    ns.supports.audioContext = supportAudioContext();
    ns.supports.mobile = mobileOrDestop();

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
