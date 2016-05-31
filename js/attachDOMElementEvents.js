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


    // #menu-lyricOption click events
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


    // menuSongList click
    var btnSongList = $('#btn-songList'),
        menuSongList = $('#menu-songlist'),
        containerSongList = $(menuSongList, '#songlist');
    $stopPropagation(btnSongList, 'click');
    $click(btnSongList, function(e) {
        NS.stackShowup.releaseAll();
        menuSongList.node.show();
        NS.stackShowup.push(function(){ menuSongList.node.hide(); });
    });
    $click(containerSongList, function(e) {
        if (e.target.tagName === 'LI') {
            e.stopPropagation();
            var index = $wrap(e.target).data('index');
            var lastSongs = NS.audio.currentPlayingSongs,
                songList = NS.audio.songList;
            _.each(lastSongs, function( song ) {
                song.stop();
            });

            songList.play(index);
        }
    });


    // menuShare click
    var btnShare = $('#btn-share'),
        menuShare = $('#menu-share');
    $stopPropagation(btnShare, 'click');
    $click(btnShare, function(e) {
        NS.stackShowup.releaseAll();
        menuShare.node.show();
        NS.stackShowup.push(function(){ menuShare.node.hide(); });
    });

    // btnFileOption
    var btnFileOption = $('.btn-fileOpt'),
        menuFileOption = $('#menu-fileOpt');
    $stopPropagation(btnFileOption, 'click');
    $click(btnFileOption, function(e) {
        NS.stackShowup.releaseAll();
        menuFileOption.node.show();
        NS.stackShowup.push(function(){ menuFileOption.node.hide(); });
    });


    // btnBack : change between pageMain and pageSystem
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

    // btnPlayMode click
    var btnPlayMode = $('#btn-playMode');
    $click(btnPlayMode, function() { btnPlayMode.node.next(); });



    // JH-bugs: when to turn lrc to album
    var viewContainer = $('#view-container'),
        viewAlbum = $('#view-album'),
        viewLyric = $('#view-lyric');
    $click( viewAlbum, function() { viewContainer.node.toggle(); });
    $click( viewLyric, function(e) {
        if (e.target.tagName == 'LI') {
            // when click on Lyric lines stop turning
            return false;
        }
        viewContainer.node.toggle();
    });


};
attachDOMElementEvents();

// this work for <audio>
function startPlay() {
    var btnIcons = {
        'play':  "url('./style/icons/play-w.svg')",
        'pause': "url('./style/icons/pause-w.svg')"
    };
    var once = false,
        viewDisk = $('span.view-disk');

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
        }
    }; // playOrPause()

    $on(btnPlay, "click", playOrPause);
}
