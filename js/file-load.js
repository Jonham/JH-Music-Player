var dragEvent = function(e) {
    e.stopPropagation();
    e.preventDefault();
    // console.log(e);
    jh = e;
};
var onFileDrop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    jh = e.dataTransfer.files[0];
    onFileRead(e.dataTransfer.files[0], onFileDecode);
};
var onFileSelect = function(dom) {
    if ( $.isDOMElement(dom) && dom.files ) {
        onFileRead(dom.files[0], onFileDecode);
    }
};
// file loading mode: 1:media; 2:lyric; 3:image
var onFileRead = function(file, callback) {
    dConsole.log('onFileRead');
    var fr = new FileReader();

    var type = file.type,
        size = file.size,
        name = file.name;
    dConsole.log('is a file of ' + type + ' || size:' + size);

    // test type support
    var loadingMode = false;
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
        dConsole.log('File subfix: ' + subfix + " || treat it as a " + typeMap(subfix));
    }

    if (!loadingMode) { return false; }

    switch (loadingMode) {
        case 1: // media file
            dConsole.log('FileReader: readAsArrayBuffer==>loading ' + file.name);
            fr.readAsArrayBuffer(file);
            break;
        case 2: // pure-text file Lyric
            dConsole.log('FileReader: readAsText==>loading ' + file.name);
            fr.readAsText(file);
            break;
        case 3:
            dConsole.log('FileReader: readAsArrayBuffer==>loading ' + file.name);
            fr.readAsArrayBuffer(file);
            break;
        default:
    }

    fr.onload = function(e) {
        dConsole.log('FileReader: file.onload;');
        callback(fr.result, loadingMode);
    };

};
var onFileDecode = function( fileBuffer, loadingMode ) {
    var audioLoader = function( fileBuffer ) {
        a = new AudioContext();
        src = a.createBufferSource();
        src.connect(a.destination);

        a.decodeAudioData(fileBuffer, function( audioBuffer ) {
            src.buffer = audioBuffer;
            dConsole.log('AudioContext: audio decode success');
            src.start(0);
            dConsole.log('AudioContext: start(0);');
        });
    };
    var lyricLoader = function( fileBuffer ) {
        dConsole.log(fileBuffer);
    };
    var imageLoader = function( fileBuffer ) {
        dConsole.log(fileBuffer);
    };

    // handling logic
    switch (loadingMode) {
        case 1:
        audioLoader(fileBuffer);
        break;
        case 2:
        lyricLoader(fileBuffer);
        break;
        case 3:
        imageLoader(fileBuffer);
        break;
        default:
    }
};

$on(document, 'dragstart', dragEvent);
$on(document, 'dragenter', dragEvent);
$on(document, 'dragover', dragEvent);
$on(document, 'dragend', dragEvent);
$on(document, 'dragleave', dragEvent);
$on(document, 'drop', onFileDrop);
