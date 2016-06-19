var Emitter = require('../Emitter.js');
var isSong = require('./isSong.js');

// extendable songlist
var SongList = function() {
    var songlist = [];
    Emitter.call(songlist);

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
            if (mode === 'SHUFFLE') {
                _songlist.init();
            }
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

    songlist.push = function() { // overwrite native Array.push to fulfill testing
        _.each(arguments, function(value) {
            if ( isSong(value) && value.states.init ) {
                Array.prototype.push.call(songlist, value);
                value.analyseFilename();

                // callback functions when update
                if (typeof(songlist.output) === 'function') {
                    songlist.output( songlist.message() );
                }

                songlist.trigger('push',{title: value.title});
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
    var _songlist = {
        index: 0,
        value: 0,
        list: [],

        init: function() {
            // don't not cover already played one
            var generateNumberArray = function( length ){
                var arr = [];
                for (var i = 0; i < length; i++ ){
                    arr.push(i);
                }
                return arr;
            };
            var shuffleCurrentList = function( list ) {
                return list.sort(
                    function(){ return Math.round( Math.random() * 2 -1 ); } );
                };

            this.list = generateNumberArray( songlist.length );
            this.list = shuffleCurrentList( this.list );

            return this;
        },
        findIndex: function(v){
            var me = this.list;
            if (v > me.length) { return -1; }

            for (var i = 0; i < me.length; i++) {
                if (me[i] === v) {
                    return i;
                }
            }
        },
        pre: function(){
            var i = this.index - 1, max = this.list.length - 1;
            var index = i < 0? max: i;

            return this.list[ index ]; // return the 'value' of songlist
        },
        next: function(){
            var i = this.index + 1, max = this.list.length - 1;
            var index = i > max? 0: i;

            return this.list[ index ];
        },
        turnNext: function( last ){
            this.value = last;
            this.index = this.findIndex( last );

            songlist.next = this.next();
            songlist.pre = this.pre();
        },
    }; // only store index of songs
    songlist.on('push', function(){
        _songlist.init();
    });

    var _nextsong = function( last ) { // generate next song index
        var me = songlist,
            mode = me.mode;
        me.playing = last;

        switch (mode) {
            case 'SHUFFLE':
                _songlist.turnNext( last );
                break;
            case 'REPEATONE':
                me.next = last;
                me.pre = (last - 1) < 0? (me.length - 1): (last - 1);
                break;
            case 'LOOP':
            default:
                me.next = (last + 1) >= me.length? 0: (last + 1);
                me.pre = (last - 1) < 0? (me.length - 1): (last - 1);
                break;
        }
    };

    songlist.play = function( index ) {
        var me = songlist;
        var index = +index;
        index = ( _.isNumber(index) && index < me.length)? index: 0;

        me[index].play(0);
        _nextsong( index );

        Toast.log('next song: ' + me[index].title );
        $('#menu-songlist').node.current( index );
    };
    // JH-todo: songlist should has a modes and playNext should add supports to that
    songlist.playNext = function() { songlist.play(songlist.next); };
    songlist.playPre = function()  { songlist.play( songlist.pre ); };

    return songlist;
};

module.exports = SongList;
