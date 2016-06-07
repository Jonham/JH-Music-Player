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
    $click(menuLyricOption, function(e) {
        menuLyricOption.node.toggle();
        dConsole.log(e.target.innerHTML);
    });


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
    });

    //onEVENTS-07: bind up onBtnCommments
    // Notes: following and using onEVENTS-06
    $click(btnComments, function(e) {
        pageMain.node.hideLeft();
        pageComments.node.showRight();
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
    $click( viewLyric, function(e) {
        if (e.target.tagName == 'LI') {
            // when click on Lyric lines stop turning
            return false;
        }
        viewContainer.node.toggle();
    });

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
                if (song.paused || song.stopped){
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
};// attachDOMElementEvents() end
attachDOMElementEvents();

// this work for <audio>
function startPlay() {
    var playOrPause = function() {
        if (!once) {
            audio.paused ? audio.play() : audio.pause();
        }
        else { // first time

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
                viewDisk.classList.add('goRound');
            });
            $on(audio, 'pause', function() {
                btnPlay.style.backgroundImage = btnIcons.play;
				viewDisk.classList.remove('goRound');
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

            once = false;
        }
    }; // playOrPause()

    // $on(btnPlay, "click", playOrPause);
}
