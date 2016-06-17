// in case AudioContext don't supported
var list = NS.audio.songlist || { init:function(){} };
list.init();
NS.dom.menuSonglist.node.bind( list );
var lyric = NS.lyric;

var btnTryout = $('#btn-tryout'),
    btnTryoutState = true;
$click(btnTryout, function(e) {
    Toast.log('Loading a Tryout Audio and Lyric file.', 10);

    var load = function( path, callback, responseType ) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path);
        xhr.onload = function() { callback( xhr.response ); };
        xhr.onerror = function(e) { throw Error( e.toString() ); };
        if (responseType) { xhr.responseType = responseType; }
        xhr.send();
    };
    
    if (btnTryoutState) {
        btnTryoutState = false;

        load('music/OneRepublic - Good Life.lrc', function(result) {
            var lrc = new NS.lyric.Lyric( new File([], 'OneRepublic - Good Life.lrc') );
            lrc._buffer = result;
            lrc.states.readFile = true;
            lrc.decode(function(){NS.lyric.push(lrc);});
        });
        load('music/OneRepublic - Good Life.mp3', function(result) {
            var song = new NS.audio.Song( new File([], 'OneRepublic - Good Life.mp3') );
            song._buffer = result;
            song.states.readFile = true;
            song.decode( function(){
                NS.audio.songlist.push(song);
                song.play();
            } );
        }, 'arraybuffer');
    }
});
