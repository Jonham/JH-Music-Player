var attachDOMElementEvents = function() {

    //onEVENTS-01: dConsole window click events
    var elemDConsole = dConsole.output;
    // $stopPropagation(elemDConsole, 'click');
    $click(elemDConsole, function(e) {
        if (elemDConsole.node.state) { return false; }
        elemDConsole.node.toggle();
		NS.stackShowup.push(function() {
			elemDConsole.node.min();
		});
	});

    //onEVENTS-02: #menu-lyricOption click events
    var btnLyricOption = $('#btn-lyricOption'),
        menuLyricOption = $('#menu-lyricOption');
    $stopPropagation(btnLyricOption, 'click');
    $click(btnLyricOption, function(e){
        NS.stackShowup.releaseAll();
        menuLyricOption.node.toggle();
		NS.stackShowup.push(function() { menuLyricOption.node.hide();} ); // auto close in 3s
    });
    // btns on menuLyricOption
    (function(){
        var _G = {
            'btnRangeLyric' : {
                selector: '.btn-rangeLyric',
                target: null,
                state: false,
                onclick: function(e) {
                    dConsole.log('Range Lyric upward or downward.');
                },
            },
            'btnEditLyric' : {
                selector: '.btn-editLyric',
                target: null,
                state: false,
                onclick: function(e) {
                    dConsole.log('Jump to Lyric Editing page.');
                },
            },
            'btnToggleLyric' : {
                selector: '.btn-toggleLyric',
                target: null,
                state: true,
                onclick: function(e) {
                    e.stopPropagation();
                    var me = _G.btnToggleLyric;
                    if (me.state) {
                        $('#lyric').style.display = 'none';
                        this.innerHTML = '显示歌词';
                        NS.audio.visualizer.setColor('white');
                    }
                    else {
                        $('#lyric').style.display = '';
                        this.innerHTML = '关闭歌词';
                        NS.audio.visualizer.setColor();
                    }
                    me.state = !me.state;
                },
            },
            'btnToggleCanvas' : {
                selector: '.btn-toggleCanvas',
                target: null,
                state: true,
                onclick: function(e) {
                    e.stopPropagation();
                    var me = _G.btnToggleCanvas;
                    if (me.state) {
                        $('#view-canvas').style.display = 'none';
                        this.innerHTML = "显示音效图";
                    }
                    else {
                        $('#view-canvas').style.display = '';
                        this.innerHTML = "关闭音效图";
                    }
                    me.state = !me.state;
                },
            },
        };

        _.each(_G, function(item, index) {
            item.target = $(menuLyricOption, item.selector);
            $click(item.target, item.onclick);
        })
    }());

    // btns on #pageMain SongOptionsGroup
    (function() {
        var wrapper = $('span.song-opt-grp'),
            favorite = $(wrapper, '#btnFavorite'),
            btnComments = $(wrapper, '.btn-comments'),
            	commentsCount = $(btnComments, 'span');

    	var favoriteState = false,
    		onFavoriteClick = function(e) {
    				e.stopPropagation();
    				favorite.className =
    					favoriteState ?
    						'favorite icon icon-favorite_border':
    						'favorited icon icon-favorite';
    						// favorite.classList.toggle('favorite');
    						// favorite.classList.toggle('favorited');
    				favoriteState = !favoriteState;
    			},
    		onCommentsClick = function(e) {
    				e.stopPropagation();
    				// commentsCount.innerHTML = 99;
    			};

    	// add listener on their parent and switch on e.target
    	$click(favorite, onFavoriteClick);
    	$click(btnComments, onCommentsClick);
    }());



    // coverMask is helper layer to all menu here
    var coverMask = $('.mask');
    $click(coverMask, function(e) {
        coverMask.node.hide();
    });

    // listener generator
    var autoHide = function(target) {
        if (!$.isDOMElement(target)) {
            throw new Error('autoHide function receive an illeagal arg.');
            return function() {}; }
        return function(e) {
            e.stopPropagation();

            NS.stackShowup.releaseAll();
            NS.stackShowup.push(function(){
                target.node.hide();
                coverMask.node.hide();
            });

            target.node.show();
            coverMask.node.show();

            NS.util.router.push(target.id);
        };
    };
    var bindBtntoMenu = function(btnSelector, menuSelector) {
        if (_.isArray(btnSelector)) {
            _.each( btnSelector, function( btn ) {
                $click($( btn ), autoHide( $(menuSelector) ) );
            });
        } else {
            $click($(btnSelector), autoHide( $(menuSelector) ) );
        }
    };

    //onEVENTS-03: menuSongList click
    bindBtntoMenu([ '#btn-songlist',
                    '.btn-songlist'], '#menu-songlist');
    //onEVENTS-04: menuShare click
    bindBtntoMenu('#btn-share', '#menu-share');
    //onEVENTS-05: btnFileOption
    bindBtntoMenu('.btn-fileOpt', '#menu-fileOpt');
    //onEVENTS-05-1: btnSidebarLeft
    bindBtntoMenu('.icon-menu-w', '#sidebar-left');

        // sub:03-1 on list item click
    var containerSongList = $('#songlist');
    $click(containerSongList, function(e) {
        if (e.target.tagName === 'LI') {
            e.stopPropagation();
            var index = $wrap(e.target).data('index');
            var songlist = NS.audio.songlist;

            songlist.play(index);
            $('#menu-songlist').node.current(+index);
        }
    });


    //onEVENTS-06: btnBack : change between pageMain and pageSystem
    var btnBack = $('#btn-back'),
        pageMain = $('#page-main'),
        pageSystem = $('#page-system'),
        btnComments = $('.btn-comments'),
        pageComments = $('#page-comments'),
        btnCommentsBack = $(pageComments, '.btn-back'),
        barSubControlCommentsPage = $(pageComments, '.bar-sub-controls'),
        barSubControlSystemPage = $(pageSystem, '.bar-sub-controls');
    $click(btnBack, function(e) {
        pageMain.node.hideRight();
        pageSystem.node.showLeft();
    });
    $click(barSubControlSystemPage, function(e) {
        pageSystem.node.hideLeft();
        pageMain.node.showRight();
        NS.util.router.push('page-main');
    });

    //onEVENTS-07: bind up onBtnCommments
    // Notes: following and using onEVENTS-06
    $click(btnComments, function(e) {
        pageMain.node.hideLeft();
        pageComments.node.showRight();
        NS.util.router.push('page-comments');
    });
    $click(btnCommentsBack, function(e) {
        pageComments.node.hideRight();
        pageMain.node.showLeft();
    });// JH-bugs: return btn on pageComments
    // JH-bugs: this sub-controls should make player play song and return to #pagemain
    // currrently just make it return to #pagemain
    $click(barSubControlCommentsPage, function(e) {
        pageComments.node.hideRight();
        pageMain.node.showLeft();
    });


    //onEVENTS-08: btnPlayMode click
    var btnPlayMode = $('#btn-playMode');
    $click(btnPlayMode, function() { btnPlayMode.node.next(); });



    //onEVENTS-09: JH-bugs: when to turn lrc to album
    var viewContainer = $('#view-container'),
        viewAlbum = $('#view-album'),
        viewDisk = $(viewAlbum, '.view-albumCover'),
        viewLyric = $('#view-lyric');
    $click( viewDisk, function() { viewContainer.node.toggle(); });
    $click( viewLyric, function(e) { viewContainer.node.toggle(); });

    //onEVENTS-10: audio controls buttons
    (function() {
        var btnPre = $id('btn-preSong'),
            btnPlayGroup = $('.btn-play'),
            btnNextGroup = $('.btn-nextSong');
        var tagTotalTime = $('#tag-totalTime');

        var timeOfAudioContext = 0,
            stateAudioLoading = false;

        var onPlaySong = function(e) {
            e.stopPropagation();

            var song = NS.audio.currentPlayingSong,
                format = NS.util.formatTimestamp,
                btn = btnPlayGroup[0];

            if (!song) { // no song, load one?
                $('input[type=file]').click();
                return false;
            }
            else {
                if (song.PAUSED || song.STOPPED){
                    if (song.duration) { tagTotalTime.innerHTML = format( song.duration ); }
                    timeOfAudioContext = NS.audio.ctx.currentTime;

                    song.play();
                    btn.node.play();
                }
                else {
                    song.pause();
                    btn.node.pause();
                }
            }
        };
        var onNextSong = function( e ) { e.stopPropagation(); NS.audio.songlist.playNext(); };
        var onPreSong = function( e ) { e.stopPropagation(); NS.audio.songlist.playPre(); };

        $click(btnPre, onPreSong);
        _.each(btnNextGroup, function( btnNextsong ) { $click(btnNextsong, onNextSong); });
        _.each(btnPlayGroup, function( btnPlay ) { $click(btnPlay, onPlaySong); });
    })();

    //onEVENTS-11: add songs
    var btnAddSong = $('.btn-addSong');
    $click(btnAddSong, function(e) {
        e.stopPropagation();
        $('input[type=file]').click();
    });

    //onEVENTS-12: #pageSystem subpage
    var subpagesSystem = $(pageSystem, '.subpage-container'),
        subpagesBtns = $(pageSystem, '.icon-group'),
        spans = $(subpagesBtns, 'span');
        _.each(spans, function(v,i){v.dataset.index=i;});
        var focusOneSpan = function( index ) {
            _.each(spans, function(span){span.classList.remove('icon-focus');});
            spans[index].classList.add('icon-focus');
        };
        $click(subpagesBtns, function(e) {
            if (e.target.tagName === 'SPAN') {
                var index = e.target.dataset.index;
                focusOneSpan(index);
                switch (index) {
                    case "0":
                        // JH-bugs: Wechat can make this from case '2'
                        subpagesSystem.node.turnTo1();
                        break;
                    case "1":
                        subpagesSystem.node.turnTo2();
                        break;
                    case "2":
                        subpagesSystem.node.turnTo3();
                        break;
                    default:

                }
            }
        });

};// attachDOMElementEvents() end
attachDOMElementEvents();
