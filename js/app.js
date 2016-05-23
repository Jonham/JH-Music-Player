// XMLHttpRequest object polyfill
if (window.XMLHttpRequest === undefined) {
	window.XMLHttpRequest = function() {
		try {
			// ActiveX Newest Version
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		}
		catch (e1) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			}
			catch (e2) {
				throw new Error("XMLHttpRequest is not supported");
			}
		}
	};
}
function classifyLrc(arr) {
	// two modes
	// 1. one TimeStamp one lyrics        normal
	// 2. several timeTags one lyrics   compressd

	// metamsg RegExp
	// ti : title
	// ar : artist
	// al : album
	// by : lyric maker
	var rgMetaMsg = /(ti|ar|al|by|offset):(.+)/;

	// timetag regexp
	// 1. mm:ss.ms
	var rgTimetag = /^(\d{2,}):(\d{2})[.:]{1}(\d{2})$/;

	// function(timetag): to transform
	// "01:01.01" ==> 60 + 1 + .01
	var parseTimetag = function(timetag) {

		var aTMP = rgTimetag.exec(timetag);
		var floatTime = parseInt(aTMP[1]) * 60 + parseInt(aTMP[2]) + parseInt(aTMP[3]) / 100;
		return floatTime;
	};

	// returnArrayObject
	// prototype oOut[12.34] = []
	var oOut = {};
	// store all lyrics and timetag
	oOut.lrc = [];
	oOut.timeTags = [];

	// go through the given array
    for (var i=0; i < arr.length; i++) {
        if (rgMetaMsg.test(arr[i])) {
            // get meta messages
            var aTMP = rgMetaMsg.exec(arr[i]);
            oOut[aTMP[1]] = aTMP[2];
        }
        else if(rgTimetag.test(arr[i])) {
            // handling timestamp and lyrics

            // in compress mode:
            // to collect series of timestamp
            var aCurrentTime = [];

            // collect all timeTags
            while (rgTimetag.test(arr[i])) {
                var fTime = parseTimetag(arr[i]);
                aCurrentTime.push(fTime);
                oOut.timeTags.push(fTime);
                i++;
            }

            // collect all the lyrics
            var strNextLRC = arr[i];
            oOut.lrc.push(strNextLRC);
            var curLrcNo = oOut.lrc.length - 1;

            // restore aCurrentTime to oOut
            // oOut[ sNow ] = [ ref to No to lrc ]
            for (var j=0; j < aCurrentTime.length; j++) {
                var sNow = aCurrentTime[j];
                if(oOut[sNow]) {
                    oOut[sNow].push(curLrcNo);
                }
                else {
                    oOut[sNow] = [curLrcNo];
                }
            }

        }
    }
    // sort
	var sortByNumber = function(a, b) { return a>b? 1: -1; };
	oOut.timeTags.sort(sortByNumber);

	return oOut;
}
// load lrc file
// notice: file encoding:
// utf-8
// ANSI
// UCS2 BigEndian
//      LittleEndian

var loadedLRClist = [];
function loadLrc(file, callback) {
    var path = "./music/";
    var url = path + file;
    var oOut = {};
    if (callback === undefined) {callback = parseLrc;}

    var response = "";

    var xhr = new XMLHttpRequest();
    	xhr.open("get", url, true);
    	xhr.send();
    	xhr.onreadystatechange = function(){
    		if (xhr.readyState == "4" && xhr.status == "200") {
    			response = xhr.responseText;
                loadedLRClist.push( callback(response) );
    		}
            return "xhr Fails";
    	};
    	return oOut;
}
// parse lrc into Array Object
// Example
//[ti:Rolling In The Deep]
//[ar:Adele]
//[al:21]
//[by:yvonne]
//
function parseLrc(str) {
    var rg = /[\[\]]/g;
    var arr = str.split(rg);
    var aOut = [];

    for (var i =0; i < arr.length; i++) {
        // mutiline of "\n"
        var sTMP = arr[i];
        sTMP.replace("\n", "");
        aOut.push(sTMP);
    }
    return classifyLrc(aOut);
}


var btnPlay = $id('play'),
    audio = $('audio'),
    btnPre = $id('pre-song'),
    btnNext = $id('next-song'),
    btnBack = $id('back'),
    totalTime = $id('total-time'),
    currentTime = $id('current-time'),
    optionMenu = $id('option-menu'),
    lyric = $id('lyric'),
    title = $id('song-title'),
    artist = $id('song-artist');

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
                totalTime.innerHTML = formatTimestamp(audio.duration);
                if (audio.paused) { audio.play(); }
            });

            $on(audio, "durationchange", function() {
                totalTime.innerHTML = formatTimestamp(audio.duration);
            });
            $on(audio, "loadedmetadata", function() {
                totalTime.innerHTML = formatTimestamp(audio.duration);
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
		title.innerHTML = lrc.ti;
		artist.innerHTML = lrc.ar;
		offsetTop = lyric.offsetTop;

		lyric.style.top = lyricHightlightOriginTop + "px";
		addScrollLrc();
		ONCE = false;
	}

	currentTime.innerHTML = formatTimestamp(audio.currentTime);

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

var onButtonBack = function() {
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

    $id('background').style.backgroundImage = 'url(./OneRepublic.jpg)';

    var onB = onButtonBack();
    $click(btnBack, onB);
    // $id('lyric-lrc').addEventListener('click', onB, false);
    // $id('lyric-album').addEventListener('click', onB, false);

    // polyfill
    $click(btnNext, function(){audio.currentTime = 0; audio.play();});
    $click(btnPre, function(){audio.currentTime = 0; audio.play();});

    onSizeChange()();
};

var btnOption = $('span#option-btn');
$click(btnOption, function(e){
        e.stopPropagation();
        e.preventDefault();
        optionMenu.classList.toggle('hide-fold');
    });
$click(optionMenu, function(e) {
        e.stopPropagation();
        optionMenu.classList.toggle('hide-fold');
        alert(e.target.innerHTML);
    });

var onSongOptionsGroup = function() {
    var wrapper = $('span.song-opt-grp'),
        favorite = $(wrapper, '#btnFavorite'),
        comments = $(wrapper, '.comments'),
        	commentsCount = $(comments, 'span'),
        fileOpt = $(wrapper, '.file-option');

	var favoriteState = false,
		onFavoriteClick = function(e) {
				favorite.className =
					favoriteState ?
						'favorite btnToggle':
						'favorited btnToggle';
						// favorite.classList.toggle('favorite');
						// favorite.classList.toggle('favorited');
				favoriteState = !favoriteState;
			},
		onCommentsClick = function(e) {
				alert('show comments');
				commentsCount.innerHTML = 99;
			},
		onFileOptionClick = function(e) {
				alert('show file option menu.');
			};

	// add listener on their parent and switch on e.target
	$on(wrapper, 'click', function(e) {
			e.stopPropagation();
			switch(e.target) {
				case favorite:
					onFavoriteClick(e);
					break;
				case comments:
					onCommentsClick(e);
					break;
				case fileOpt:
					onFileOptionClick(e);
					break;
				default:
					// other elements or public function
			}
		});
};
onSongOptionsGroup();
