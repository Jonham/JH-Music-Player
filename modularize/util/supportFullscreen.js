// FullScreen
var supportFullscreen = (function(docElem) {
    var fullscreen = cancelFullscreen = null;
    var fsWays = ['requestFullScreen', 'mozRequestFullScreen', 'webkitRequestFullScreen'],
        cfsWays = ['cancelFullscreen', 'mozCancelFullScreen', 'webkitCancelFullScreen'];
    var requestFullScreen = function( elem ) {
        for (var index = 0; index < fsWays.length; index++) {
            if (docElem[ fsWays[index] ]) {
                fullscreen = fsWays[index]; break;
            }
        }
        if (!fullscreen) { return false; }
        return elem[fullscreen]();
    };
    var cancelFullScreen = function() {
        for (var index = 0; index < cfsWays.length; index++) {
            if (document[ cfsWays[index] ]) {
                cancelFullscreen = cfsWays[index]; break;
            }
        }
        return document[cancelFullscreen]();
    }
    return {
        requestFullScreen: requestFullScreen,
        cancelFullScreen:  cancelFullScreen
    };
})(document.documentElement);

module.exports = supportFullscreen;
