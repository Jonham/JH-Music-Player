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
