var dragEvent = function(e) {
    e.stopPropagation();
    e.preventDefault();
    // console.log(e);
    jh = e;
};
var onFileDrop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    dConsole.log(e.dataTransfer.files[0].name);
    jh = e.dataTransfer.files[0];
    onFileRead(e.dataTransfer.files[0], audioLoader);
};
var onFileRead = function(file, callback) {
    dConsole.log('onFileRead');
    var fr = new FileReader();

    dConsole.log('FileReader: readAsArrayBuffer');
    dConsole.log('FileReader: loading ' + file.name);

    fr.readAsArrayBuffer(file);
    fr.onload = function(e) {
        dConsole.log('FileReader: file.onload;');
        callback(fr.result);
    };
};
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

$on(document, 'dragstart', dragEvent);
$on(document, 'dragenter', dragEvent);
$on(document, 'dragover', dragEvent);
$on(document, 'dragend', dragEvent);
$on(document, 'dragleave', dragEvent);
$on(document, 'drop', onFileDrop);
