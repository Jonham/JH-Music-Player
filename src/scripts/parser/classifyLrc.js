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