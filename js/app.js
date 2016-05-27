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
        menuOption   = $('#menu-option'),
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
    NS.dom.menuOption = attachNodeTo( menuOption, {
        hide: function(second) {
            window.clearTimeout( timers.menuOption );
            timers.menuOption =
                window.setTimeout(
                    function(){ menuOption.classList.add('menu-hidetoRB'); },
                    _.isNumber(second)? second: 0
                ); },
        show: function(second) {
            window.clearTimeout( timers.menuOption );
            timers.menuOption =
                window.setTimeout(
                    function(){ menuOption.classList.remove('menu-hidetoRB'); },
                    _.isNumber(second)? second: 0
                ); },
        toggle: function(second) {
            window.clearTimeout( timers.menuOption );
            timers.menuOption =
                window.setTimeout(
                    function(){ menuOption.classList.toggle('menu-hidetoRB'); },
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
    // dConsole.debug(ranges);
    _.each(ranges, function(range) {
        var bindViewToControler = function(type) {
            dConsole.debug(type);
            switch (type) {
                case 'range-volume':
                    return function( percent ) { // value in [0, 100]
                        var audio = $('audio');
                        audio.volume = percent;
                        return audio.volume;
                    };
                case 'range-time':
                    return function( percent ) {
                        var a = $('audio');
                        a.currentTime = percent * a.duration;
                        return a.currentTime;
                    }
                default:
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

};
addDOMElementNodeProperty();

var attachDOMElementEvents = function() {
    // dConsole window click events
    var elemDConsole = dConsole.output;

    $stopPropagation(elemDConsole, 'click');
    $click(elemDConsole, function(e) {
        if (elemDConsole.node.state) { return false; }
        elemDConsole.node.toggle();
		NS.stackShowup.push(function() {
			elemDConsole.node.min();
		});
	});

    // #menu-option click events
    var btnOption = $('#option-btn'),
        menuOption = $('#menu-option');
    $stopPropagation(btnOption, 'click');
    $click(btnOption, function(e){
        NS.stackShowup.releaseALl();
        menuOption.node.toggle();
		NS.stackShowup.push(function() { menuOption.node.hide();} ); // auto close in 3s
    });
    $click(menuOption, function(e) {
        menuOption.node.toggle();
        dConsole.log(e.target.innerHTML);
    });

    var btnSongList = $('#btn-songList'),
        menuSonglist = $('#menu-songlist');
    $stopPropagation(btnSongList, 'click');
    $click(btnSongList, function(e) {
        NS.stackShowup.releaseALl();
        menuSonglist.node.show();
        NS.stackShowup.push(function(){ menuSonglist.node.hide(); });
    });

    var btnShare = $('#btn-share'),
        menuShare = $('#menu-share');
    $stopPropagation(btnShare, 'click');
    $click(btnShare, function(e) {
        NS.stackShowup.releaseALl();
        menuShare.node.show();
        NS.stackShowup.push(function(){ menuShare.node.hide(); });
    });

    // .btn-fileOpt
    var btnFileOption = $('.btn-fileOpt'),
    menuFileOption = $('#menu-fileOpt');
    $stopPropagation(btnFileOption, 'click');
    $click(btnFileOption, function(e) {
        NS.stackShowup.releaseALl();
        menuFileOption.node.show();
        NS.stackShowup.push(function(){ menuFileOption.node.hide(); });
    });

    var btnBack = $('#btn-back'),
        pageMain = $('#page-main'),
        pageSystem = $('#page-system');
    $click(btnBack, function(e) {
        pageMain.node.hide();
        pageSystem.node.show();
    });
    // bugs: polyfill  shortcut to return to pageMain
    $click(pageSystem, function(e) {
        pageSystem.node.hide();
        pageMain.node.show();
    });

    var btnPlayMode = $('#btn-playMode');
    $click(btnPlayMode, function() {
        btnPlayMode.node.next();
    });
};
attachDOMElementEvents();

function startPlay() {
    var btnIcons = {
        'play':  "url('./style/icons/play-w.svg')",
        'pause': "url('./style/icons/pause-w.svg')"
    };
    var once = false,
        disk = $('span.disk');

    var playOrPause = function() {
        if (once) {
            audio.paused ? audio.play() : audio.pause();
        }
        else { // first time
            once = true;

            audio.src = './music/OneRepublic - Good Life.mp3';
            // auto play
            $on(audio, "canplay", function() {
                tagTotalTime.innerHTML = formatTimestamp(audio.duration);
                if (audio.paused) { audio.play(); }
            });

            $on(audio, "durationchange", function() {
                tagTotalTime.innerHTML = formatTimestamp(audio.duration);
            });
            $on(audio, "loadedmetadata", function() {
                tagTotalTime.innerHTML = formatTimestamp(audio.duration);
            });

            $on(audio, 'play', function() {
                btnPlay.style.backgroundImage = btnIcons.pause;
                disk.classList.add('goRound');
            });
            $on(audio, 'pause', function() {
                btnPlay.style.backgroundImage = btnIcons.play;
				disk.classList.remove('goRound');
            });
            // media loaded seekable range
            var loaded = $('span.loaded');
            $on(audio, 'progress', function(e){
              loaded.style.width = this.seekable.length * 100 + '%';
            });

            // turnoff all hightlighted lines when user seekable
            $on(audio, 'seeking', function(e) {
                var domLIs = $(lyric, '.focus');
                var aFocus = Array.prototype.slice.apply(domLIs);
                aFocus.forEach(function(ele) {ele.className = 'line';});
            });
        }
    }; // playOrPause()

    $on(btnPlay, "click", playOrPause);
}

function addScrollLrc() {
    var lrc = loadedLRClist[0],
        timeline = lrc.timeTags,
        tempUL = document.createElement('ul');

    for (var line = 0; line < timeline.length; line++) {
        var t = lrc[timeline[line]][0];
        var li = document.createElement("li");
        li.className = "line";
        li.dataset.line = t;
        li.innerHTML = lrc.lrc[t];
        tempUL.appendChild(li);
    }
    lyric.innerHTML = tempUL.innerHTML;
}

function formatTimestamp(time) {
    // current time show like 01:01 under the play&pause button
	var timeS = {}; // n: now; s: second; m: minute;
	timeS.n = parseInt(time);
	timeS.s = timeS.n % 60;
	timeS.m = parseInt(timeS.n / 60);

	return ("00" + timeS.m).substr(-2) + ":" + ("00" + timeS.s).substr(-2);
}

var OFFSET = 0.5; // offset between lrc and audio : 0.5 for GoodLife.mp3 only
var offsetTop = "";
var lyricHightlightOriginTop = 160;
var ONCE = true;

$on(audio, "timeupdate", function(e) {
    var lrc = loadedLRClist[0];
    var timeline = lrc.timeTags;
    var lrcList = lrc.lrc;

    var curTime = audio.currentTime + OFFSET;

	if (ONCE) {
        // title message
        var tagSongTitle = $id('tag-songTitle'),
            tagSongArtist = $id('tag-songArtist');
		tagSongTitle.innerHTML = lrc.ti;
		tagSongArtist.innerHTML = lrc.ar;
		offsetTop = lyric.offsetTop;

		lyric.style.top = lyricHightlightOriginTop + "px";
		addScrollLrc();
		ONCE = false;
	}

	tagCurrentTime.innerHTML = formatTimestamp(audio.currentTime);

    // auto scroll lyrics
	for (var i=0; i<timeline.length; i++) {
        // find the index of next line of lyrics: i
		if (curTime <= timeline[i]) {
			var arrLrcList = lrc[timeline[i-1]] || []; // get lyric array by lrc[time]
			var aChild = lyric.childNodes;
            // scroll the lyrics as audio play
			if (i - 2 >= 0) {
				aChild[i - 1].className = "line focus";
				aChild[i - 2].className = "line";
				lyric.style.top = lyricHightlightOriginTop -(aChild[i - 1].offsetTop) + "px";
			} else if (i >= 1) {
				aChild[i - 1].className = "line focus";
				lyric.style.top = lyricHightlightOriginTop -(aChild[i - 1].offsetTop) + "px";
			}

			var strLrcTMP = "";
			// 加载多行歌词
			for (var j=0; j < arrLrcList.length; j++) {
				strLrcTMP += lrcList[ arrLrcList[j] ];
			}

			return strLrcTMP;
		}
	}
});

var onTurnLrcAndAlbum = function() {
    var main = $id('main'),
        lyric = $id('lyric-lrc'),
        album = $id('lyric-album'),
        disk  = $(album, '.disk'),
        page = 0; // lyric-lrc

    var listener = function(e) {
        if (page == 0) {
            lyric.style.opacity = 0;
            album.style.display = '';
            album.style.opacity = 1;
            main.style.backgroundColor = 'rgba(0,0,0,.5)';
            page = 1;
        } else {
            lyric.style.opacity = 1;
            album.style.opacity = 0;
            album.style.display = 'none';
            main.style.backgroundColor = 'rgba(0,0,0,.8)';
            page = 0;
        }
    };

    return listener;
};
window.onload = function() {

	loadLrc("OneRepublic - Good Life.lrc", parseLrc);

    startPlay();

    $id('page-main').style.backgroundImage = 'url(./OneRepublic.jpg)';

    var preloadImage = function( urlArray ) {
        if (!_.isArray(urlArray)) { return false; }

        var startTime = +new Date(), success = [], fail = [];
        var process = function(index) {
            console.log('loaded ' + index);
            if (index === urlArray.length - 1) {
                dConsole.log('Images loaded: success x ' + success.length + "|| fail x " + fail.length);
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
    var aImageURL = [
        'style/icons/favorited-w.svg',
        'style/icons/mode-loop-w.svg',
        'style/icons/mode-repeatone-w.svg'
    ];
    preloadImage(aImageURL);

    // bugs here: when to turn lrc to album
    var lyricAlbum = $('#lyric-album'),
        lyricLrc = $('#lyric-lrc'),
        onB = onTurnLrcAndAlbum();
    $click(lyricAlbum, onB);
    $click(lyricLrc, function(e) {
        if (e.target.tagName == 'LI') {
            return false;
        }

        onB();
    });

    // polyfill
    var btnPre = $id('btn-preSong'),
    btnNext = $id('btn-nextSong');
    $click(btnNext, function(){audio.currentTime = 0; audio.play();});
    $click(btnPre, function(){audio.currentTime = 0; audio.play();});

    // if window receive 'click' event, it will pop up all callback functions in stackShowup
    $click(window, function(e) {
		NS.stackShowup.releaseALl();
	}, false);
    onSizeChange()();
	onFileLoad();
};

var onSongOptionsGroup = function() {
    var wrapper = $('span.song-opt-grp'),
        favorite = $(wrapper, '#btnFavorite'),
        btnComments = $(wrapper, '.btnComments'),
        	commentsCount = $(btnComments, 'span');

	var favoriteState = false,
		onFavoriteClick = function(e) {
				e.stopPropagation();
				favorite.className =
					favoriteState ?
						'favorite btnToggle':
						'favorited btnToggle';
						// favorite.classList.toggle('favorite');
						// favorite.classList.toggle('favorited');
				favoriteState = !favoriteState;
			},
		onCommentsClick = function(e) {
				e.stopPropagation();
				dConsole.log('show comments');
				commentsCount.innerHTML = 99;
			};

	// add listener on their parent and switch on e.target
	$click(favorite, onFavoriteClick);
	$click(btnComments, onCommentsClick);
};
onSongOptionsGroup();
