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
  // 2. several TimeStamps one lyrics   compressd
  
  // metamsg RegExp 
  // ti : title
  // ar : artist
  // al : album
  // by : lyric maker
  var metamsgRG = /(ti|ar|al|by|offset):(.+)/;
  
  // timestamp regexp
  // 1. mm:ss.ms
  var timestampRG = /^(\d{2,}):(\d{2})[.:]{1}(\d{2})$/;
  
  // function(timestamp): to transform 
  // "01:01.01" ==> 60 + 1 + .01
  var transformTimestamp = function(timestamp) {
    var oTMP = timestampRG.exec(timestamp);
    var floatTime = parseInt(oTMP[1]) * 60 + parseInt(oTMP[2]) + parseInt(oTMP[3]) / 100;
    return floatTime;
  };
  
  // returnArrayObject
  // prototype objRT[12.34] = []
  var objRT = {};
  // store all lyrics and timestamp
  objRT.lrc = [];
  objRT.timeStamps = [];
  
  // go through the given array
  for (var i=0; i < arr.length; i++) {
    if (metamsgRG.test(arr[i])) {
      // get meta messages
      var oTMP = metamsgRG.exec(arr[i]);
//      console.log("metamsg: " + oTMP);
      objRT[oTMP[1]] = oTMP[2];
      
    }
    else if(timestampRG.test(arr[i])) {
      // handling timestamp and lyrics
      
      // in compress mode:
      // to collect series of timestamp
      var arrCurrentTime = [];
      
      // collect all timestamps
      while (timestampRG.test(arr[i])) {
//        console.log("time: " + arr[i]);
        var fTime = transformTimestamp(arr[i]);
        arrCurrentTime.push(fTime);
        objRT.timeStamps.push(fTime);
        i++;
      }
      
      // collect all the lyrics
      var strNextLRC = arr[i];
//        console.log("lyric: " + arr[i]);
      objRT.lrc.push(strNextLRC);
      var curLrcNo = objRT.lrc.length - 1;
      
      // restore arrCurrentTime to objRT
      // objRT[ curTime ] = [ ref to No to lrc ]
      for (var j=0; j < arrCurrentTime.length; j++) {
        var curtime = arrCurrentTime[j];
        if(objRT[curtime]) {
          objRT[curtime].push(curLrcNo); 
        }
        else {
          objRT[curtime] = [curLrcNo];
        }
      }
      
    }
  }
  function sortByNumber(a, b) {
		return a>b? 1: -1;
	}
	objRT.timeStamps.sort(sortByNumber);
	
  return objRT;
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
	var objRT = {};
  if (callback === undefined) {callback = parseLrc;}
  
  var response = "";
  
  var xhr = new XMLHttpRequest();
		xhr.open("get", url, true);
		xhr.send();
		xhr.onreadystatechange = function(){
			if (xhr.readyState == "4" && xhr.status == "200") {
				response = xhr.responseText;
        loadedLRClist.push( callback(response) );
				objRT.lrc = loadedLRClist[loadedLRClist.length - 1];
				return objRT;
			}
      return "xhr Fails";
		};
		return objRT;
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
  var arrRT = [];

  for (var i =0; i < arr.length; i++) {
    // mutiline of "\n"
    var strTMP = arr[i];
    strTMP.replace("\n", "");
    arrRT.push(strTMP);
  }
  return classifyLrc(arrRT);
}


var fileList = [
"Adele-Rolling in the Deep.lrc",
"Andrea Bocelli - The Prayer.lrc",
"OneRepublic - Good Life.lrc",
"Rolling.lrc",
"齐秦-火柴天堂.lrc"
];

function test() {
  for (var i = 0; i < fileList.length; i++) {
    loadLrc(fileList[i], parseLrc);
  }
}
var audio = document.getElementById("mp3");
var span = document.getElementById("w");
var wrap = document.getElementById("wrap");
var img = document.getElementById("alImg");
var songMsg = document.getElementById("songMsg");
var scrollLrc = document.getElementById("scrollLrc");
var playMode = document.getElementById("playMode");
var playTime = document.getElementById("playTime");
var msgBox = document.getElementById("message");


function audioLoading(tag) {
  if (tag && tag.nodeName === 'AUDIO') {
    return Math.floor(tag.buffered.end(0) / tag.duration * 100);
  }
    return Math.floor(audio.buffered.end(0) / audio.duration * 100);
  
}

var updatePercent = function() {
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
  
    
	var ctx = playMode.getContext('2d');
			ctx.fillStyle = "rgba(200,200,200,.8)";
			
			img.addEventListener("click", playandpause, false);
			var state = false;
			function playandpause() {
				if (audio.paused) {
					audio.play();
					ctx.clearRect(0,0,80,80);
					ctx.fillRect(0,0,30,80);
					ctx.fillRect(50,0,30,80);
				}
				else{
					audio.pause();
					ctx.clearRect(0,0,80,80);
					ctx.beginPath();
					ctx.moveTo(10,0);
					ctx.lineTo(80,40);
					ctx.lineTo(10,80);
					ctx.closePath();
					ctx.fill();
				}
			}
					// play btn
					ctx.clearRect(0,0,80,80);
					ctx.beginPath();
					ctx.moveTo(10,0);
					ctx.lineTo(80,40);
					ctx.lineTo(10,80);
					ctx.closePath();
					ctx.fill();
			
			function addScrollLrc() {
				var lrc = loadedLRClist[0];
				var timeline = lrc.timeStamps;
				
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
          ctx.clearRect(0,0,80,80);
					ctx.fillRect(0,0,30,80);
					ctx.fillRect(50,0,30,80);}
      });
  
      audio.addEventListener("ended", function() {
					ctx.clearRect(0,0,80,80);
					ctx.beginPath();
					ctx.moveTo(10,0);
					ctx.lineTo(80,40);
					ctx.lineTo(10,80);
					ctx.closePath();
					ctx.fill();
      });
  
			audio.addEventListener("timeupdate", function() {
				
				var lrc = loadedLRClist[0];
				var timeline = lrc.timeStamps;
				var lrcList = lrc.lrc;
				var OFFSET = 0.5;
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
					if (curTime <= timeline[i]) {
						var arrLrcList = lrc[timeline[i-1]];
						var aChild = scrollLrc.childNodes;
						if (i - 2 >= 0) {
							aChild[i - 1].className = "line focus";
							aChild[i - 2].className = "line";
							scrollLrc.style.top = originTop -(aChild[i - 1].offsetTop) + "px";
						} else {
							aChild[i - 1].className = "line focus";
							scrollLrc.style.top = originTop -(aChild[i - 1].offsetTop) + "px";
						}
						
						var strLrcTMP = "";
						// 加载多行歌词
						for (var j=0; j < arrLrcList.length; j++) {
							strLrcTMP += lrcList[arrLrcList[j]];
							
						}
						//console.log(strLrcTMP);
						//span.innerHTML = strLrcTMP;

						return strLrcTMP;
					}
				}
			}, false);
}