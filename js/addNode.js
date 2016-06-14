;;
var addDOMElementNodeProperty = function() {
    var attachNodeTo = function(elem, attr) {
        if (!$.isDOMElement(elem) || !_.isObject(attr)) return false;
        if (elem.node !== undefined) {
            console.error(elem + ' already got a node attribute.');
            return false;
        }
        elem.node = attr;
        return elem;
    };

    var pageMain     = $('#page-main'),
        pageSystem   = $('#page-system'),
        subpagesSystem = $(pageSystem, '.subpage-container'),
        pageComments   = $('#page-comments'),
        sidebarLeft  = $('#sidebar-left'),
        menuSonglist = $('#menu-songlist'),
        menuShare    = $('#menu-share'),
        menuFileOption = $('#menu-fileOpt'),
        menuLyricOption   = $('#menu-lyricOption'),
        elemDConsole = $('#dConsole'),
        btnPlayMode  = $('#btn-playMode'),
        coverMask = $('.mask');

    var timers = {};
    if (NS.dom === undefined) { NS.dom = {}; }
    NS.dom.pageMain = attachNodeTo( pageMain, {
        hideRight: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.add('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        showRight: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.remove('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        hideLeft: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.add('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        showLeft: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.remove('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        toggleRight: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.toggle('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        toggleLeft: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.toggle('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.pageSystem = attachNodeTo( pageSystem, {
        hideLeft: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.add('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        showLeft: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.remove('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        toggleLeft: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.toggle('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        hideRight: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.add('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        showRight: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.remove('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        toggleRight: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.toggle('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.subpagesSystem = attachNodeTo( subpagesSystem, {
        currentPage: 1,
        page1: $(subpagesSystem, 'div')[0],
        page2: $(subpagesSystem, 'div')[1],
        page3: $(subpagesSystem, 'div')[2],
        turnTo1: function(){
            var me = subpagesSystem.node;
            me.page1.classList.remove('page-hide-left');
            me.page2.classList.add('page-hide-right');
            me.page3.classList.add('page-hide-right');
            me.currentPage = 1;
        },
        turnTo2: function(){
            var me = subpagesSystem.node;
            me.page2.classList.remove('page-hide-left');
            me.page2.classList.remove('page-hide-right');
            me.page1.classList.add('page-hide-left');
            me.page3.classList.add('page-hide-right');
            me.currentPage = 2;
        },
        turnTo3: function(){
            var me = subpagesSystem.node;
            me.page3.classList.remove('page-hide-right');
            me.page2.classList.remove('page-hide-right');
            me.page2.classList.add('page-hide-left');
            me.page1.classList.add('page-hide-left');
            me.currentPage = 3;
        },
    }),
    NS.dom.pageComments = attachNodeTo( pageComments, {
        hideRight: function(second) {
            window.clearTimeout( timers.pageComments );
            timers.pageComments =
                window.setTimeout(
                    function(){ pageComments.classList.add('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        showRight: function(second) {
            window.clearTimeout( timers.pageComments );
            timers.pageComments =
                window.setTimeout(
                    function(){ pageComments.classList.remove('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        toggleRight: function(second) {
            window.clearTimeout( timers.pageComments );
            timers.pageComments =
                window.setTimeout(
                    function(){ pageComments.classList.toggle('page-hide-right'); },
                    _.isNumber(second)? second: 0
                ); },
        hideLeft: function(second) {
            window.clearTimeout( timers.pageComments );
            timers.pageComments =
                window.setTimeout(
                    function(){ pageComments.classList.add('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        showLeft: function(second) {
            window.clearTimeout( timers.pageComments );
            timers.pageComments =
                window.setTimeout(
                    function(){ pageComments.classList.remove('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
        toggleLeft: function(second) {
            window.clearTimeout( timers.pageComments );
            timers.pageComments =
                window.setTimeout(
                    function(){ pageComments.classList.toggle('page-hide-left'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.sidebarLeft = attachNodeTo( sidebarLeft, {
        hide: function(second) {
            window.clearTimeout( timers.sidebarLeft );
            timers.sidebarLeft =
                window.setTimeout(
                    function(){ sidebarLeft.classList.add('sidebar-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.sidebarLeft );
            timers.sidebarLeft =
                window.setTimeout(
                    function(){ sidebarLeft.classList.remove('sidebar-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.sidebarLeft );
            timers.sidebarLeft =
                window.setTimeout(
                    function(){ sidebarLeft.classList.toggle('sidebar-hide'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.menuShare = attachNodeTo( menuShare, {
        hide: function(second) {
            window.clearTimeout( timers.menuShare );
            timers.menuShare =
                window.setTimeout(
                    function(){ menuShare.classList.add('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.menuShare );
            timers.menuShare =
                window.setTimeout(
                    function(){ menuShare.classList.remove('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.menuShare );
            timers.menuShare =
                window.setTimeout(
                    function(){ menuShare.classList.toggle('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.menuFileOption = attachNodeTo( menuFileOption, {
        hide: function(second) {
            window.clearTimeout( timers.menuFileOption );
            timers.menuFileOption =
                window.setTimeout(
                    function(){ menuFileOption.classList.add('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.menuFileOption );
            timers.menuFileOption =
                window.setTimeout(
                    function(){ menuFileOption.classList.remove('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.menuFileOption );
            timers.menuFileOption =
                window.setTimeout(
                    function(){ menuFileOption.classList.toggle('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.menuSonglist = attachNodeTo( menuSonglist, {
        bindedSongList: null,
        hide: function(second) {
            window.clearTimeout( timers.menuSonglist );
            timers.menuSonglist =
                window.setTimeout(
                    function(){ menuSonglist.classList.add('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.menuSonglist );
            timers.menuSonglist =
                window.setTimeout(
                    function(){ menuSonglist.classList.remove('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.menuSonglist );
            timers.menuSonglist =
                window.setTimeout(
                    function(){ menuSonglist.classList.toggle('menu-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        update: function( arrMessage ) {
            var songlist = $('#songlist'),
                viewCount = $(menuSonglist, '.count'),
                temp = $wrap('ul');
            _.each(arrMessage, function(value, index){
                temp.add(
                    $wrap('li').html(value.title)
                               .data('index', index)
                               .add( $wrap('span').html( " - " + value.artist ).getNode() )
                               .getNode() );
            });
            // add all titles to songlist
            $wrap( songlist ).empty()
                    .html( temp.html() );
            // update #menuSonglist song counts
            viewCount.innerHTML = arrMessage.length;
            menuSonglist.node.current( NS.audio.songlist? NS.audio.songlist.playing: 0 );
        },
        bind: function( songlist ) {
            if ( typeof(songlist) !== 'object' || songlist.MODES !== undefined ) {
                songlist.output = function( arrTitles ) {
                    menuSonglist.node.update( arrTitles );
                };
            }
                },
        current: function( index ) {
            var me = menuSonglist;
            var last = $(me, '.current');

            // remove last span.current current class
            if (last && _.isNumber(last.length) ) {
                _.each(last, function(item){ item.classList.remove('current');});
            } else {
                if (last) { last.classList.remove('current'); }
            }

            var group = $(me, 'li');
            if (group.length) {
                group[ index ].classList.add('current');
            } else {
                group && group.classList.add('current');
            }
        },
    });
    NS.dom.menuLyricOption = attachNodeTo( menuLyricOption, {
        hide: function(second) {
            window.clearTimeout( timers.menuLyricOption );
            timers.menuLyricOption =
                window.setTimeout(
                    function(){ menuLyricOption.classList.add('menu-hidetoRB'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.menuLyricOption );
            timers.menuLyricOption =
                window.setTimeout(
                    function(){ menuLyricOption.classList.remove('menu-hidetoRB'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.menuLyricOption );
            timers.menuLyricOption =
                window.setTimeout(
                    function(){ menuLyricOption.classList.toggle('menu-hidetoRB'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.elemDConsole = attachNodeTo( elemDConsole, {
        state: false, // true for maxed, false for mined
        MAX: true,
        MIN: false,
        min: function() {
            var a = dConsole.messageArray;
            elemDConsole.classList.remove('dConsole-window');
            elemDConsole.innerHTML = a[ a.length -1 ];

            // set status as MIN
            elemDConsole.node.state = false;
        },
        max: function() {
            elemDConsole.classList.add('dConsole-window');
            // add log messages as ol
            var ol = $dom('ol');
    		_.each( dConsole.messageArray, function(value) {
    			var li = $dom('li');
    			li.innerHTML = value;
    			ol.appendChild(li);
    		});
    		elemDConsole.innerHTML = '';
    		elemDConsole.appendChild(ol);

            // set state as MAX
            elemDConsole.node.state = true;
        },
        toggle: function() {
            var thisNode = elemDConsole.node;
            thisNode.state?
                thisNode.min():
                thisNode.max();
        },
    });
    NS.dom.btnPlayMode = attachNodeTo( btnPlayMode, {
        state: 1, // 'LOOP' by default
        mode: 'LOOP',
        Modes: ['SHUFFLE', 'LOOP', 'REPEATONE'],
        // toggle: function() {
        //     btnPlayMode.node.next();
        //     },
        next: function() {
                    var n = btnPlayMode.node;
                    var map = n.Modes;
                    var nextState = ++n.state > 2? 0: n.state;

                    n.mode = map[nextState];
                    n.state = nextState;

                    n.update(n.mode);

                    btnPlayMode.dispatchEvent(new Event('playmodechange'), {
                        'bubbles': false,
                        'defaultPrevented': true,
                        'isTrusted': true,
                        'target': btnPlayMode,
                        'originalTarget': btnPlayMode,
                        'srcElement': btnPlayMode
                    });
                },
        update: function( mode ) {
            var map = {
                'SHUFFLE': 'icon icon-shuffle',
                'LOOP': 'icon icon-repeat',
                'REPEATONE': 'icon icon-repeat_one'
            };
            btnPlayMode.className = map[mode]; }
    });
    NS.dom.coverMask = attachNodeTo( coverMask, {
        covered: false,
        hide: function(second) {
            window.clearTimeout( timers.coverMask );
            timers.coverMask =
                window.setTimeout(
                    function(){
                        coverMask.node.covered = false;
                        coverMask.style.display = 'none'; },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.coverMask );
            timers.coverMask =
                window.setTimeout(
                    function(){
                        coverMask.node.covered = true;
                        coverMask.style.display = 'block'; },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.coverMask );
            timers.coverMask =
                window.setTimeout(
                    function(){
                        if (coverMask.node.covered) { // covered
                            coverMask.style.display = 'none';
                        } else {
                            coverMask.style.display = 'block';
                        }
                        coverMask.node.covered != coverMask.node.covered;
                    },
                    _.isNumber(second)? second: 0
                ); },
    });

    // binded up related object actions
    //BINDUP-01: Ranges: rangeTime and rangeVolume
    var ranges = $('.range'); // rangeTime and rangeVolume
    _.each(ranges, function(range) {
        // this will generate function to change value of <audio>
        var bindViewToControler = function(type) {
            // dConsole.debug(type);
            switch (type) {
                case 'range-volume':
                    return function( percent ) { // value in [0, 100]
                        try {
                            // var audio = $('audio');
                            // audio.volume = percent;
                            var gain = NS.audio.headGain;
                            gain.gain.value = percent;
                        } catch(e) { dConsole.error(e); jh = e; }
                        // return audio.volume;
                        return gain.gain.value;
                    };
                case 'range-time':
                    return function( percent ) {
                        try {
                            // var a = $('audio');
                            // a.currentTime = percent * a.duration;
                            var song = NS.audio.currentPlayingSong;
                            if (!song) { return false; }
                            if (!song.duration) { song.getDuration(); }
                            song.playAt( percent * song.duration );

                        } catch(e) { dConsole.error(e); jh = e; }
                        return song;
                    }
                default: // some new tag?
                    return function(v) { dConsole.log(type + " change to value " + v); };
            }
        };

        // add node to their parentNode range
        attachNodeTo(range, {
            rangeTo: function( percent ) {
                var btn  = $(range, '.range-btn'),
                    fill = $(range, '.range-fill');
                // test percent in [0, 100]
                var p = percent<0? 0:
                            percent>1? 1: percent;

                btn.style.left = p * 100 + '%';
                fill.style.width = p * 100 + '%';

                return range; // return their parentNode
            },
            change: bindViewToControler( range.id )
        });
    });
    //BINDUP-07: audio time range binding
    var audioTimestamps = $('.tag-audioTimestamp');
    _.each(audioTimestamps, function( item ) {
        attachNodeTo(item, {
            update: function( time ) {
                item.innerHTML = NS.util.formatTimestamp(time);
                return item;
            }
        });
    });


    //BINDUP-02: tagSongMessage.node.update(String title, String artist)
    var tagSongMessage = $('#tag-songMessage'),
        tagTitleGroup = $('.tag-title'),
        tagArtistGroup = $('.tag-artist');
    NS.dom.tagSongMessage = attachNodeTo(tagSongMessage, {
        update: function(vTitle, vArtist) {
            var setString = function(target, value) {
                target.innerHTML = _.isString(value)? value: target.innerHTML;
            };
            var removeSubfix = function(v) {
                if (!_.isString(v) ) { return v; }
                var r = v.split('.');
                if (r[ r.length-1 ].length > 3) { // subfix must less than 3 charactors
                    return r.join('.');
                } else {
                    r.pop();
                    return r.join('.');
                }
            };

            // var title = $(tagSongMessage, '#tag-songTitle'),
            //     artist = $(tagSongMessage, '#tag-songArtist');
            if(_.isObject(vTitle)) {
                _.each(tagTitleGroup, function( titleItem ) { setString(titleItem, removeSubfix(vTitle.title) );  } );
                _.each(tagArtistGroup, function( artistItem ) { setString(artist, vTitle.artist);  } );
            } else {
                _.each(tagTitleGroup, function( titleItem ) { setString(titleItem, removeSubfix(vTitle) );  } );
                _.each(tagArtistGroup, function( artistItem ) { setString(artistItem, vArtist );  } );
            }
        }
    });

    //BINDUP-03: #view-container #view-album #view-albumCover
    (function() {
        var main = $('#main'),
        viewContainer = $('#view-container'),
        rangeVolume = $('#range-volume'),
        viewLyric = $('#view-lyric'),
        viewAlbum = $('#view-album'),
        viewDisk  = $(viewAlbum, '.view-albumCover'),

        LYRIC = 0,
        ALBUM = 1,
        currentView = 0; // view-lyric

        var toggleViewDiskGoRoundNode = {
            turnOn: function() { viewDisk.classList.add('goRound'); },
            turnOff: function() { viewDisk.classList.remove('goRound'); }
        };

        NS.dom.viewContainer = attachNodeTo( viewContainer, {
            LYRIC: 0,
            ALBUM: 1,
            toggle: function() {
                if (currentView === LYRIC) {
                    viewLyric.style.opacity = 0;
                    // rangeVolume.style.display = "none";
                    viewAlbum.style.display = '';
                    viewAlbum.style.opacity = 1;
                    // lighter the background
                    main.style.backgroundColor = 'rgba(0,0,0,.5)';
                    currentView = ALBUM;
                }
                else { // currentView === ALBUM
                    // NS.lyric.lookup( NS.audio.currentPlayingSong && NS.audio.currentPlayingSong.title );
                    viewLyric.style.opacity = 1;
                    viewAlbum.style.opacity = 0;
                    // rangeVolume.style.display = "block";
                    viewAlbum.style.display = 'none';
                    // darken background
                    main.style.backgroundColor = 'rgba(0,0,0,.8)';
                    currentView = LYRIC;
                }
            },
            turn: function() {}
        });
        // JH-unfinished: function to fill
        NS.dom.viewLyric = attachNodeTo( viewLyric, {
            select: function() {},
            share: function() {}
        });

        NS.dom.viewAlbum = attachNodeTo( viewAlbum, toggleViewDiskGoRoundNode );
        NS.dom.viewDisk = attachNodeTo( viewDisk, toggleViewDiskGoRoundNode );

    })();

    //BINDUP-04: FullScreen
    var viewport = $('#viewport'),
        btnFullScreen = $('#btn-fullscreen'),
        fullscreen = NS.supports.fullscreen,
        state_FullScreen = false;

    var fsELEM = (function(){
        var a = ['webkitFullscreenElement','mozFullScreenElement','fullScreenElement'];
        for (var i = 0, l=a.length; i < l; i++) {
            if (document[ a[i] ] !== undefined) { return a[i]; }
        }
    }());

    var onFSchange =function(e) {
        if (document[fsELEM]) { // FullScreen
            btnFullScreen.innerHTML = "Exit FullScreen.";
            state_FullScreen = true;
        }
        else {
            btnFullScreen.innerHTML = "Go FullScreen Now!";
            state_FullScreen = false;
        }
    };
    $on(document, 'webkitfullscreenchange mozfullscreenchange fullscreenchange', onFSchange);
    $on(window, 'keyup', function(e){
        var b = document.body,
            s = window.screen;

        if (e.keyCode !== 122) { return false; } // F11
        if (!state_FullScreen) {
            btnFullScreen.innerHTML = "Exit FullScreen. (Press F11)";
            state_FullScreen = true;
        }
        else {
            btnFullScreen.innerHTML = "Go FullScreen Now!";
            state_FullScreen = false;
        }
    });

    $click(btnFullScreen, function(e) {
        if (state_FullScreen) { fullscreen.cancelFullScreen(); }
        else                  { fullscreen.requestFullScreen( viewport ); }
    });
    // $on(viewport, 'dblclick', fullscreenListener);

    //BINDUP-05: button #btn-showConsole
    var btnShowConsole = $('#btn-showConsole');
    $click( btnShowConsole, function(e) { dConsole.output.node.max(); });
    $click(dConsole.output, function(e) { dConsole.output.node.min(); });

    //BINDUP-06: audio control buttons
    var btnPlaySystem = $(pageSystem, '.btn-play'),
        btnPlayMainpage = $(pageMain, '.btn-play');
    NS.dom.btnPlay = attachNodeTo( btnPlayMainpage, {
        play: function() {
            btnPlaySystem.classList.add('icon-btn-play-r');
            btnPlaySystem.classList.remove('icon-btn-pause-r');

            btnPlayMainpage.classList.add('icon-btn-play-w');
            btnPlayMainpage.classList.remove('icon-btn-pause-w');
        },
        pause: function() {
            btnPlaySystem.classList.add('icon-btn-pause-r');
            btnPlaySystem.classList.remove('icon-btn-play-r');

            btnPlayMainpage.classList.add('icon-btn-pause-w');
            btnPlayMainpage.classList.remove('icon-btn-play-w');
        }
    });
    btnPlaySystem.node = btnPlayMainpage.node;

};
addDOMElementNodeProperty();
