var Lyric = require('./LyricClass.js');
var isLyric = require('./isLyric.js');
var isOneFile = require('../../util/isOneFile.js');
var $ = require('../../getter/$getter.js');
var _ = require('../../lib/underscore-min.js');

var LyricList = function() {
    if (this === window) { return new LyricList(); }
    var me = this;
    me.defaults = {
        currentView: $('#view-lyric'),
    };

    me.Lyric = Lyric;
    me.list = {};
    me.currentLyric = null;
    me.currentView  = null;
    me.__lastListener = null;

    me.push = function( lyric ) {
        var me = me.lyric,
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
        if ( fileOneTitle ) {
            // same file
            if ( isOneFile(fileOneTitle, lyric)) { return true; }
            // same title but different files
            list[ lyric.title ] = [ fileOneTitle, lyric ];
        }

        list[ lyric.title ] = lyric;
    };

    me.bindLyric = function( lyric, callback ) {
        me.currentLyric = lyric;
        if (!lyric.states.decode) {
            lyric.decode(function() {
                callback && callback();
            });
        } else {
            callback && callback();
        }
    };
    me.bindView = function( view, lyric ){
        if (!$.isDOMElement(view) ) { return false; }

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
    };

    me.start = function( lyric ) {
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

        me.bindLyric(lyric, function() { me.bindView( me.defaults.currentView ); });

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
    };

    me.end = function() {
        $off(NS.audio.ctx, 'timeupdate', me.__lastListener);
        if (!me.currentView) { me.bindView(me.defaults.currentView); }

        var ul = $(me.currentView, 'ul');
        ul.innerHTML =
        '<span style="position:absolute;top:50%;width:100%;left:0;text-align:center;"><span class="btn" style="color:rgba(255,255,255,0.6);" onclick="$(\'input[type=file]\').click();">Click option button to add a lyric file.</span></span>';
    };

    me.lookup = function( title ) {
        if (me.list[ title ]) { // match
            me.start( me.list[ title ] );
            Toast.log('lyric found.', 'fast');
        }
        else { // no match
            me.end();
            Toast.log('no match lyric.', 'fast');
        }
    };

    me.refresh = function() {
        if (!me.currentView) {
            return false;
        }
        else {
            var lines = $(me.currentView, '.focus');
            _.each(lines, function( l ){
                l.classList.remove('focus');
            });
        }
    };

    return me;
};

module.exports = LyricList;
