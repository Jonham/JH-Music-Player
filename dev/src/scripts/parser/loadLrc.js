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
    			oOut.lrc = loadedLRClist[ loadedLRClist.length - 1 ];
    			return oOut;
    		}
            return "xhr Fails";
    	};
    	return oOut;
}
