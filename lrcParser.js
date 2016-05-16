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
    var path = location.href + "music/";
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
    			oOut.lrc = loadedLRClist[loadedLRClist.length - 1];
    			return oOut;
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

var audio = $id("mp3"),
    // span = $id("w"),
    wrap = $id("wrap"),
    img = $id("alImg"),
    songMsg = $id("songMsg"),
    scrollLrc = $id("scrollLrc"),
    playMode = $id("playMode"),
    playTime = $id("playTime"),
    msgBox = $id("message");

/* draw button on playMode
 * Note: this currently only work on one size
*/
var drawBtn = (function() {
    var DrawOnCanvas = function(canvas){
        var ctx = this.ctx = canvas.getContext('2d');

        ctx.fillStyle = "rgba(200,200,200,.8)";
        this.draw = function(type) {
            switch (type) {
                case 'pause':
                    // draw pause button
                    ctx.clearRect(0,0,80,80);
                    ctx.fillRect(0,0,30,80);
                    ctx.fillRect(50,0,30,80);

                    img.classList.add('round'); // go round
                    break;
                case 'play':
                    ctx.clearRect(0,0,80,80);
                    ctx.beginPath();
                    ctx.moveTo(10,0);
                    ctx.lineTo(80,40);
                    ctx.lineTo(10,80);
                    ctx.closePath();
                    ctx.fill();

                    img.classList.remove('round'); // go round
                    break;
                default:
                    // do nothing
            }
        };

        return this;
    };

    return new DrawOnCanvas(playMode);
})();
// function that invoke when audio is caching.
var updatePercent = function() {
    var audioLoading = function(tag) {
        if (tag && tag.nodeName === 'AUDIO') {
            return Math.floor(tag.buffered.end(0) / tag.duration * 100);
        }
        return Math.floor(audio.buffered.end(0) / audio.duration * 100);
    };

    msgBox.innerHTML = "加载中：" + audioLoading() + "/100";

    if (audioLoading() <= 100) {
        var set = setTimeout(updatePercent, 100);
    }
    if (audioLoading() === 100) {
        msgBox.parentNode.display = "none";
    }

};

function startPlay() {
    audio.src = "./music/OneRepublic - Good Life.mp3";
    var state = false;
    var playOrPause = function() {
		if (audio.paused) {
			audio.play();
			drawBtn.draw('pause');
		}
		else{
			audio.pause();
			drawBtn.draw('play');
		}
	};
    img.addEventListener("click", playOrPause, false);

    // initialize
    drawBtn.draw('play');

function addScrollLrc() {
    var lrc = loadedLRClist[0];
    var timeline = lrc.timeTags;

    for (var line = 0; line < timeline.length; line++) {
        var t = lrc[timeline[line]][0];
        var li = document.createElement("li");
        li.className = "line";
        li.dataset.line = t;
        li.innerHTML = lrc.lrc[t];
        scrollLrc.appendChild(li);
    }
}

var ONCE = true;

audio.addEventListener("canplay", function() {
    updatePercent();
    if (audio.paused) {
        audio.play();
        drawBtn.draw('pause');
    }
}, false);

audio.addEventListener("ended",function() {
    drawBtn.draw('play');
}, false);

audio.addEventListener("timeupdate", function() {

	var lrc = loadedLRClist[0];
	var timeline = lrc.timeTags;
	var lrcList = lrc.lrc;
	var OFFSET = 0.5; // offset between lrc and audio

	var curTime = audio.currentTime + OFFSET;
	var offsetTop = "";
	var originTop = 30;

	if (ONCE) {
		wrap.style.backgroundImage = "url('" + location.href + "OneRepublic.jpg')";
		var ti = document.createElement("span");
		ti.id = "title";
		ti.innerHTML = lrc.ar + " - " + lrc.ti;
		songMsg.appendChild(ti);
		songMsg.appendChild(document.createElement("br"));
		var al = document.createElement("span");
		al.id = "album";
		al.innerHTML = lrc.al;
		songMsg.appendChild(al);
		offsetTop = scrollLrc.offsetTop;


		scrollLrc.style.top = originTop + "px";
		addScrollLrc();
		ONCE = false;
	}

	var timeS = {};
	timeS.n = parseInt(audio.currentTime);
	timeS.s = timeS.n % 60;
	timeS.m = parseInt(timeS.n / 60);

	playTime.innerHTML = ("00" + timeS.m).substr(-2) + ":" + ("00" + timeS.s).substr(-2);

	for (var i=0; i<timeline.length; i++) {
        // find the index of next line of lyrics: i
		if (curTime <= timeline[i]) {
			var arrLrcList = lrc[timeline[i-1]];
			var aChild = scrollLrc.childNodes;
            // scroll the lyrics as audio play
			if (i - 2 >= 0) {
				aChild[i - 1].className = "line focus";
				aChild[i - 2].className = "line";
				scrollLrc.style.top = originTop -(aChild[i - 1].offsetTop) + "px";
			} else if (i >= 1) {
				aChild[i - 1].className = "line focus";
				scrollLrc.style.top = originTop -(aChild[i - 1].offsetTop) + "px";
			}

			var strLrcTMP = "";
			// 加载多行歌词
			for (var j=0; j < arrLrcList.length; j++) {
				strLrcTMP += lrcList[arrLrcList[j]];

			}
			// console.log(strLrcTMP);
			// span.innerHTML = strLrcTMP;

			return strLrcTMP;
		}
	}
}, false);
}
