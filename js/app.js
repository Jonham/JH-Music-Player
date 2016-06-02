function addScrollLrc(lrc) {
    var lrc = lrc || loadedLRClist[0],
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


window.onload = function() {

	// loadLrc("OneRepublic - Good Life.lrc", parseLrc);

    startPlay();

    var preloadImage = function( urlArray ) {
        if (!_.isArray(urlArray)) { return false; }

        var startTime = +new Date(), success = [], fail = [];
        var process = function(index) {
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


    // polyfill
    var btnPre = $id('btn-preSong'),
    btnNext = $(mainControls, '.btn-nextSong');
    $click(btnNext, function(){audio.currentTime = 0; audio.play();});
    $click(btnPre, function(){audio.currentTime = 0; audio.play();});

    // if window receive 'click' event, it will pop up all callback functions in stackShowup
    $click(window, function(e) {
		NS.stackShowup.releaseAll();
	}, false);
    onSizeChange()();
	onFileLoad();
};

var onSongOptionsGroup = function() {
    var wrapper = $('span.song-opt-grp'),
        favorite = $(wrapper, '#btnFavorite'),
        btnComments = $(wrapper, '.btn-comments'),
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
