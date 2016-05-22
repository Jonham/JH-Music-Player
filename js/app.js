// this is just a draft
function $id(id){ return document.getElementById(id); }
function $(str, bGetOne) {
    if(document.querySelector && document.querySelectorAll) {
        return bGetOne?
                document.querySelector(str):
                document.querySelectorAll(str);
    } else {
        switch (str.substr(0,1)) {
            case '#':
                return document.getElementById(str.substr(1));
            case '.':
                var oByCN = document.getElementsByClassName(str.substr(1));
                return bGetOne?
                        oByCN[0]:
                        oByCN;
            default:
                var oByTN = document.getElementsByTagName(str.substr(1));
                return bGetOne?
                        oByTN[0]:
                        oByTN;
        }
    }
}
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
    audio = document.querySelector('audio'),
    btnPre = $id('pre-song'),
    btnNext = $id('next-song'),
    btnBack = $id('back'),
    totalTime = $id('total-time'),
    currentTime = $id('current-time'),
    optionMenu = $id('option-menu'),
    lyric = $id('lyric'),
    title = $id('song-title'),
    artist = $id('song-artist');

    var btnIcons = {
        'play':  "url('./style/icons/play-w.svg')",
        'pause': "url('./style/icons/pause-w.svg')"
    };
function startPlay() {
    var once = false,
        disk = document.querySelector('span.disk');

    var playOrPause = function() {
        if (once) {
            audio.paused ? audio.play() : audio.pause();
        }
        else { // first time
            once = true;

            audio.src = './music/OneRepublic - Good Life.mp3';
            // auto play
            audio.addEventListener("canplay", function() {
                totalTime.innerHTML = formatTimestamp(audio.duration);
                if (audio.paused) { audio.play(); }
            }, false);
            audio.addEventListener('play', function() {
                btnPlay.style.backgroundImage = btnIcons.pause;
                disk.style.animationPlayState = 'running';
            }, false);
            audio.addEventListener('pause', function() {
                btnPlay.style.backgroundImage = btnIcons.play;
                disk.style.animationPlayState = 'paused';
            }, false);
        }
    }; // playOrPause()

    btnPlay.addEventListener("click", playOrPause, false);
}

function addScrollLrc() {
    var lrc = loadedLRClist[0];
    var timeline = lrc.timeTags;
    lyric.innerHTML = '';

    for (var line = 0; line < timeline.length; line++) {
        var t = lrc[timeline[line]][0];
        var li = document.createElement("li");
        li.className = "line";
        li.dataset.line = t;
        li.innerHTML = lrc.lrc[t];
        lyric.appendChild(li);
    }
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
var originTop = 160;
var ONCE = true;

audio.addEventListener("timeupdate", function(e) {
    var lrc = loadedLRClist[0];
    var timeline = lrc.timeTags;
    var lrcList = lrc.lrc;

    var curTime = audio.currentTime + OFFSET;

	if (ONCE) {
        // title message
		title.innerHTML = lrc.ti;
		artist.innerHTML = lrc.ar;
		offsetTop = lyric.offsetTop;

		lyric.style.top = originTop + "px";
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
				lyric.style.top = originTop -(aChild[i - 1].offsetTop) + "px";
			} else if (i >= 1) {
				aChild[i - 1].className = "line focus";
				lyric.style.top = originTop -(aChild[i - 1].offsetTop) + "px";
			}

			var strLrcTMP = "";
			// 加载多行歌词
			for (var j=0; j < arrLrcList.length; j++) {
				strLrcTMP += lrcList[ arrLrcList[j] ];
			}

			return strLrcTMP;
		}
	}
}, false);

var onButtonBack = function() {
    var lyric = $id('lyric-lrc'),
        album = $id('lyric-album'),
        main = $id('main'),
        disk  = album.querySelector('.disk'),
        page = 0; // lyric-lrc

    var listener = function(e) {
        if (page == 0) {
            lyric.style.opacity = 0;
            album.style.opacity = 1;
            main.style.backgroundColor = 'rgba(0,0,0,.5)';
            page = 1;
        } else {
            lyric.style.opacity = 1;
            album.style.opacity = 0;
            main.style.backgroundColor = 'rgba(0,0,0,.8)';
            page = 0;
        }
    };

    return listener;
};

window.onload = function() {
	loadLrc("OneRepublic - Good Life.lrc", parseLrc);

    startPlay();

    optionMenu.style.display = 'none';

    $id('background').style.backgroundImage = 'url(./OneRepublic.jpg)';

    var onB = onButtonBack();
    btnBack.addEventListener('click', onB, false);
    $id('lyric-lrc').addEventListener('click', onB, false);
    $id('lyric-album').addEventListener('click', onB, false);

    // polyfill
    btnNext.addEventListener('click', function(){audio.currentTime = 0; audio.play();}, false);
    btnPre.addEventListener('click', function(){audio.currentTime = 0; audio.play();}, false);


    onSizeChange()();
};
