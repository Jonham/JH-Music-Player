var onFileLoad = function() {
    var dragEvent = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };
    var onFileDrop = function(e) { // handle files that droped with onFileRead(file, handleFile)
        e.stopPropagation();
        e.preventDefault();
        var filelist = e.dataTransfer.files;

        _.each(filelist, function(value) {
            onFileRead(value, handleFile);
        });
    };
    var onFileSelect = function(dom) {
        if ( $.isDOMElement(dom) && dom.files ) {
            _.each(dom.files, function(value) {
                onFileRead(value, handleFile);
            });
        }
    };
    // file loading mode: 1:media; 2:lyric; 3:image
    var onFileRead = function(file, callback) {

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

        var type = file.type,
            name = file.name;
        var aMsg = name.split('.'),
        subfix = aMsg[ aMsg.length - 1];
        typeMapBySubfix( subfix );

        if (type !== '') {
            var aMIME = type.split('/');
            typeMapByMIME( aMIME[0] );
        } else {
        }

        if (!loadingMode) { return false; }

        switch (loadingMode) {
            case 1: // media file
                dConsole.log('onFileRead: loading ' + file.name);
                callback( new NS.audio.Song( file ), loadingMode );
                break;
            case 2: // pure-text file Lyric
                dConsole.log('onFileRead: loading ' + file.name);
                callback( new NS.lyric.Lyric( file ), loadingMode );
                break;
            case 3:
                dConsole.log('onFileRead: loading ' + file.name);
                callback( new NS.album.AlbumCover( file ), loadingMode );
                // fr.readAsDataURL(file);
                break;
            default:
        }

        // fr.onload  = function(e) { callback(fr.result, loadingMode, fileMsg); };
        // fr.onerror = function(e) { dConsole.log('ERROR: FileReader=>' + e); };

    };

    /* audioLoader: NS.audio
     ------------------------------------------------
     *         songlist => playlist, current one is in songlist[0]
     *         ctx   => AudioContext Instance
     * bufferSources => ctx.createBufferSource() Instance ==> because their buffer can only set once
     *
    */
    var handleFile = function( file, loadingMode ) { // var audioLoader = function( file, fileMsg ) {
        var handleAudioFile = function( song ) {
            if (!NS.audio) {
                console.error('Your browser don\'t support AudioContext, Please use a modern browser and try me again.');
                return false;
            }

            // let
            var songlist = NS.audio.songlist;

            songlist.push( song );

            // if there is other song on the songlist, add this song to the list too
            if (songlist.length > 1) {
                dConsole.log('audioLoader: song added to Playlist.');
                return false;
            }

            // if this is the first song add, play it right away
            song.connect(function() {
                song.play(0);
                NS.dom.btnPlay.node.play();
            });

        };

        // lyric file loader
        var handleLyricFile = function( lyric ) {
            NS.lyric.push(lyric);
            lyric.decode();
            dConsole.log(lyric.fileName + ' added to NS.lyric.list.');
        };

        // image file loader
        var handleImageFile = function( cover ) {
            NS.album.push( cover );
            cover.readFile(function(){ cover.setBackgroundTo( $('#page-main')); });
        };

        // handling logic
        switch (loadingMode) {
            case 1:
                handleAudioFile(file);
                break;
            case 2:
                handleLyricFile(file);
                break;
            case 3:
                handleImageFile(file);
                break;
            default:
        }
    }; // handleFile

    if ( !NS.supports.mobile ) {
        // dConsole.log('support drag&drop');
        $on(document, 'dragstart', dragEvent);
        $on(document, 'dragenter', dragEvent);
        $on(document, 'dragover', dragEvent);
        $on(document, 'dragend', dragEvent);
        $on(document, 'dragleave', dragEvent);
        $on(document, 'drop', onFileDrop);
    }

    var fileInput = $('#fileLoader');
    $on(fileInput, 'change', function(e) {
        if (fileInput.files.length >= 1) {
            onFileSelect(fileInput);
        }
    });
    $stopPropagation(fileInput, 'click');
};
