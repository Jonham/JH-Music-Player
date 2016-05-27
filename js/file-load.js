var onFileLoad = function() {
    var dragEvent = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    var onFileDrop = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var filelist = e.dataTransfer.files;

        _.each(filelist, function(value) {
            onFileRead(value, onFileDecode);
        });
    };
    var onFileSelect = function(dom) {
        if ( $.isDOMElement(dom) && dom.files ) {
            _.each(dom.files, function(value) {
                onFileRead(value, onFileDecode);
            });
        }
    };
    // file loading mode: 1:media; 2:lyric; 3:image
    var onFileRead = function(file, callback) {
        var fr = new FileReader();

        var type = file.type,
            size = file.size,
            name = file.name,
            fileMsg = {
                name: name,
                size:  size,
                type:  type
            };
            dConsole.debug(fileMsg);
        // dConsole.log('is a file of ' + type + ' || size:' + size);

        // test type support
        var loadingMode = -1;
        var typeMapBySubfix = function( subfix ) {
            switch (subfix) {
                case 'mp3':
                loadingMode = 1;
                return 'media: audio file MP3';
                case 'lrc':
                loadingMode = 2;
                return 'pure-text: Lyric file';
                case 'jpg':
                case 'png':
                case 'gif':
                loadingMode = 3;
                return 'image: Album cover file';
                default:
                return 'Unknown File type';
            }
        };
        var typeMapByMIME = function( mime ) {
            switch ( mime ) {
                case 'audio':
                loadingMode = 1;
                return 'media: audio file';
                case 'image':
                loadingMode = 3;
                return 'image: Album cover file';
                default:
                return 'Unknown File type';
            }
        };

        var aMsg = name.split('.'),
        subfix = aMsg[ aMsg.length - 1];
        if (type !== '') {
            var aMIME = type.split('/');
            typeMapByMIME( aMIME[0] );
            dConsole.log('File MIME: ' + type + " || treat it as a " + aMIME[0] + ' file.');
        } else {
        }
        // test twice
        dConsole.log('File subfix: ' + subfix + " || treat it as a " + typeMapBySubfix(subfix));

        if (!loadingMode) { return false; }

        switch (loadingMode) {
            case 1: // media file
            dConsole.log('FileReader: loading ' + file.name);
            fr.readAsArrayBuffer(file);
            break;
            case 2: // pure-text file Lyric
            dConsole.log('FileReader: loading ' + file.name);
            fr.readAsText(file, 'GB2312');
            // fr.readAsText(file);
            break;
            case 3:
            dConsole.log('FileReader: loading ' + file.name);
            fr.readAsDataURL(file);
            break;
            default:
        }

        fr.onload = function(e) {
            // dConsole.log('FileReader: file loaded.');
            callback(fr.result, loadingMode, fileMsg);
        };
        fr.onerror = function(e) {
            dConsole.log('ERROR: FileReader=>' + e);
        };

    };

    /* audioLoader: NS.audio
     ------------------------------------------------
     *         songs => playlist, current one is in songs[0]
     *         ctx   => AudioContext Instance
     * bufferSources => ctx.createBufferSource() Instance ==> because their buffer can only set once
     *
    */
    var onFileDecode = function( fileBuffer, loadingMode, fileMsg ) {
        var audioLoader = function( fileBuffer, fileMsg ) {
            if (!NS.audio) {
                NS.audio = {};
                NS.audio.ctx = new AudioContext();
                NS.audio.songs = [];
                NS.audio.bufferSources = [];
            }

            // let
            var   ctx = NS.audio.ctx,
                songs = NS.audio.songs,
            bufferSrc = NS.audio.bufferSources;

            songs.push({
                message:fileMsg,
                buffer: fileBuffer });

            if (songs.length > 1) {
                dConsole.log('audioLoader: song added to Playlist.');
                return false;
            }
            var addAudioBuffer = function(ctx, songItem) {
                // create a new audio buffer source
                var srcNode = ctx.createBufferSource();
                srcNode.connect(ctx.destination);

                NS.audio.bufferSources.push(srcNode);

                ctx.decodeAudioData(songItem.buffer, function( audioBuffer ) {
                    srcNode.buffer = audioBuffer;
                    // dConsole.log('AudioContext: audio decode success');
                    srcNode.start(0);
                    dConsole.log('start playing ' + songItem.message.name);

                    // update song message to NS.dom.tagSongMessage
                    var result = songItem.message.name.split('-'),
                        // name:  ARTIST-TITLE.mp3
                        artist = result[0].trim();
                        result.shift();
                        title = result.join('-');
                    NS.dom.tagSongMessage.node.update( title, artist );
                });

                srcNode.onended = function() {
                    dConsole.log('last song ended.');
                    var songs = NS.audio.songs;
                    songs.shift();
                    if (songs.length) { // if there are songs, load first one
                        addAudioBuffer(ctx, songs[0]);
                    }
                }
            };

            addAudioBuffer(ctx, songs[0]);

        };
        var lyricLoader = function( fileBuffer ) {
            dConsole.log(fileBuffer);
        };
        var imageLoader = function( fileBuffer ) {
            dConsole.log('imageLoader: set image as new background.');
            $wrap('#page-main').backgroundImage(fileBuffer);
        };

        // handling logic
        switch (loadingMode) {
            case 1:
                audioLoader(fileBuffer, fileMsg);
                break;
            case 2:
                lyricLoader(fileBuffer, fileMsg);
                break;
            case 3:
                imageLoader(fileBuffer, fileMsg);
                break;
            default:
        }
    };
    var dragOrSelect = function() {
        var ug = navigator.userAgent;
        var result = ug.search(/windows|x11|Mac.*(^iphone)/ig);
        dConsole.log(result === -1? 'Use input[type=file] to add files' : 'Drag&Drop files onto me!');
        // return true if userAgent fulfill desktop-browser conditions
        //   and browser support AudioContext() [webkitAudioContext() included]
        return NS.supports.audioContext && result !== -1;
    };
    if (dragOrSelect() ) {
        // dConsole.log('support drag&drop');
        $on(document, 'dragstart', dragEvent);
        $on(document, 'dragenter', dragEvent);
        $on(document, 'dragover', dragEvent);
        $on(document, 'dragend', dragEvent);
        $on(document, 'dragleave', dragEvent);
        $on(document, 'drop', onFileDrop);
    }
    else {
        // dConsole.log('use input[type=file] to load file.');
        var fileInput = $dom('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
        document.body.appendChild(fileInput);
        $on(fileInput, 'change', function(e) {
            if (fileInput.files.length >= 1) {
                onFileSelect(fileInput);
            }
        });
        $stopPropagation(fileInput, 'click');

        NS.stackShowup.push(function() {
            fileInput.style.display = 'none';
        });
    }
};

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
