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
        name = file.name;
        // dConsole.log('is a file of ' + type + ' || size:' + size);

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
            // dConsole.log('File MIME: ' + type + " || treat it as a " + aMIME[0] + ' file.');
        } else {
        }
        // test twice
        // dConsole.log('File subfix: ' + subfix + " || treat it as a " + typeMapBySubfix(subfix));

        if (!loadingMode) { return false; }

        switch (loadingMode) {
            case 1: // media file
            dConsole.log('FileReader: loading ' + file.name);
            fr.readAsArrayBuffer(file);
            break;
            case 2: // pure-text file Lyric
            dConsole.log('FileReader: loading ' + file.name);
            fr.readAsText(file);
            break;
            case 3:
            dConsole.log('FileReader: loading ' + file.name);
            fr.readAsDataURL(file);
            break;
            default:
        }

        fr.onload = function(e) {
            // dConsole.log('FileReader: file loaded.');
            callback(fr.result, loadingMode);
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
    var onFileDecode = function( fileBuffer, loadingMode ) {
        var audioLoader = function( fileBuffer ) {
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

            songs.push(fileBuffer);

            if (songs.length > 1) {
                dConsole.log('audioLoader: song added to Playlist.');
                return false;
            }
            var addAudioBuffer = function(ctx, fileBuffer) {
                // create a new audio buffer source
                var src = ctx.createBufferSource();
                src.connect(ctx.destination);

                NS.audio.bufferSources.push(src);

                ctx.decodeAudioData(fileBuffer, function( audioBuffer ) {
                    src.buffer = audioBuffer;
                    // dConsole.log('AudioContext: audio decode success');
                    src.start(0);
                    dConsole.log('AudioContext: start playing;');
                });

                src.onended = function() {
                    dConsole.log('last song ended.');
                    var songs = NS.audio.songs;
                    songs.shift();
                    if (songs.length) {
                        addAudioBuffer(ctx, songs[0]);
                    }
                }
            };

            addAudioBuffer(ctx, fileBuffer);

        };
        var lyricLoader = function( fileBuffer ) {
            dConsole.log(fileBuffer);
        };
        var imageLoader = function( fileBuffer ) {
            dConsole.log('imageLoader: set image as new background.');
            $wrap('#background').backgroundImage(fileBuffer);
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
    var dragOrSelect = function() {
        var ug = navigator.userAgent;
        var result = ug.search(/windows|x11|Mac.*(^iphone)/ig);
        dConsole.log(result === -1? 'Use input[type=file] to add files' : 'Drag&Drop files onto me!');
        return result !== -1; // return true if contains 'windows'
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
            fileInput.accept = 'audio/*';
        document.body.appendChild(fileInput);
        $on(fileInput, 'change', function(e) {
            if (fileInput.files.length >= 1) {
                onFileSelect(fileInput);
            }
        });
        NS.stackShowup.push(function() {
            fileInput.style.display = 'none';
        });
    }
};
