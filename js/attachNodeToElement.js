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
        sidebarLeft  = $('#sidebar-left'),
        menuSonglist = $('#menu-songlist'),
        menuShare    = $('#menu-share'),
        menuFileOption = $('#menu-fileOpt'),
        menuLyricOption   = $('#menu-lyricOption'),
        elemDConsole = $('#dConsole'),
        btnPlayMode  = $('#btn-playMode');

    var timers = {};
    if (NS.dom === undefined) { NS.dom = {}; }
    NS.dom.pageMain = attachNodeTo( pageMain, {
        hide: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.add('mainpage-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.remove('mainpage-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.pageMain );
            timers.pageMain =
                window.setTimeout(
                    function(){ pageMain.classList.toggle('mainpage-hide'); },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.pageSystem = attachNodeTo( pageSystem, {
        hide: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.add('page-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.remove('page-hide'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.pageSystem );
            timers.pageSystem =
                window.setTimeout(
                    function(){ pageSystem.classList.toggle('page-hide'); },
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
        min: function(second) {
            window.clearTimeout( timers.elemDConsole );
            timers.elemDConsole =
                window.setTimeout(
                    function(){
                        var a = dConsole.messageArray;
                        elemDConsole.classList.remove('dConsole-window');
                        elemDConsole.innerHTML = a[ a.length -1 ];

                        // set status as MIN
                        elemDConsole.node.state = false;
                    },
                    _.isNumber(second)? second: 0
                ); },
        max: function(second) {
            window.clearTimeout( timers.elemDConsole );
            timers.elemDConsole =
                window.setTimeout(
                    function(){
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
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.elemDConsole );
            timers.elemDConsole =
                window.setTimeout(
                    function(){
                        var thisNode = elemDConsole.node;
                        thisNode.state?
                            thisNode.min():
                            thisNode.max();
                    },
                    _.isNumber(second)? second: 0
                ); },
    });
    NS.dom.btnPlayMode = attachNodeTo( btnPlayMode, {
        state: 0,
        mode: 'SHUFFLE',
        Modes: ['SHUFFLE', 'LOOP', 'REPEATONE'],
        // toggle: function() {
        //     btnPlayMode.node.next();
        //     },
        next: function() {
                    var n = btnPlayMode.node;
                    var map = ['SHUFFLE', 'LOOP', 'REPEATONE'];
                    var nextState = ++n.state > 2? 0: n.state;

                    n.mode = map[nextState];
                    n.state = nextState;

                    n.update(n.mode);
                },
        update: function( mode ) {
            var path = function(name) { return 'url("./style/icons/mode-'+ name.toLowerCase() + '-w.svg")'; }
            btnPlayMode.style.backgroundImage = path(mode); }
    });


    // binded object actions
    var ranges = $('.range'); // rangeTime and rangeVolume
    // Ranges: rangeTime and rangeVolume
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
                            var gain = NS.audio.gain;
                            gain.gain.value = percent;
                        } catch(e) { dConsole.error(e); jh = e; }
                        // return audio.volume;
                        return gain.gain.value;
                    };
                case 'range-time':
                    return function( percent ) {
                        try {
                            var a = $('audio');
                            a.currentTime = percent * a.duration;
                        } catch(e) { dConsole.error(e); jh = e; }
                        return a.currentTime;
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

    var tagSongMessage = $('#tag-songMessage');
    // tagSongMessage.node.update(String title, String artist)
    NS.dom.tagSongMessage = attachNodeTo(tagSongMessage, {
        update: function(vTitle, vArtist) {
            var setString = function(target, value) {
                target.innerHTML = _.isString(value)? value: targetInnerHTML;
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

            var title = $(tagSongMessage, '#tag-songTitle'),
                artist = $(tagSongMessage, '#tag-songArtist');
            if(_.isObject(vTitle)) {
                setString(title, removeSubfix(vTitle.title) );
                setString(artist, vTitle.artist);
            } else {
                setString(title, removeSubfix(vTitle) );
                setString(artist, vArtist);
            }
        }
    });

    // #view-container
    (function() {
        var main = $('#main'),
        viewContainer = $('#view-container'),
        viewLyric = $('#view-lyric'),
        viewAlbum = $('#view-album'),
        disk  = $(viewAlbum, '.disk'),

        LYRIC = 0,
        ALBUM = 1,
        currentView = 0; // view-lyric

        NS.dom.viewContainer = attachNodeTo( viewContainer, {
            LYRIC: 0,
            ALBUM: 1,
            toggle: function() {
                if (currentView === LYRIC) {
                    viewLyric.style.opacity = 0;
                    viewAlbum.style.display = '';
                    viewAlbum.style.opacity = 1;
                    // lighter the background
                    main.style.backgroundColor = 'rgba(0,0,0,.5)';
                    currentView = ALBUM;
                }
                else { // currentView === ALBUM
                    viewLyric.style.opacity = 1;
                    viewAlbum.style.opacity = 0;
                    viewAlbum.style.display = 'none';
                    // darken background
                    main.style.backgroundColor = 'rgba(0,0,0,.8)';
                    currentView = LYRIC;
                }
            },
            turn: function() {}
        });
    })();

};
addDOMElementNodeProperty();
