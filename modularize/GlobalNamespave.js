var LocalFilelist       = require('./file/LocalFilelist.js');
var stackShowup         = require('./stackShowup.js');

var supportAudioContext = require('./util/supportAudioContext.js');
var isMobile            = require('./util/isMobile.js');
var supportFullscreen   = require('./util/supportFullscreen.js');

var audioCtx        = require('./file/audioCtx.js');
var LyricList       = require('./file/Lyric/LyricList.js');

var formatTimestamp = require('./util/formatTimestamp.js');
var preloadImage    = require('./util/preloadImage.js');
var isFile          = require('./util/isFile.js');
var isOneFile       = require('./util/isOneFile.js');
var isLyric         = require('./file/Lyric/isLyric.js');
var router          = require('./util/Router.js');
var createStyle     = require('./util/createStyle.js');

var GlobalNamespace = (function( w,namespace) {
    var ns = w[ namespace ] = {};
    // Binding to NS
    // adding to w.NS;
    ns.localfilelist = new LocalFilelist();
    ns.stackShowup = stackShowup;

    ns.supports = {
        audioContext: supportAudioContext(),
        mobile: isMobile(),
        fullscreen: supportFullscreen,
    };

    ns.audio = audioCtx();

    ns.lyric = new LyricList();

    ns.util = {
        formatTimestamp: formatTimestamp,
        preloadImage:    preloadImage,
        isFile:          isFile,
        isOneFile:       isOneFile,
        isLyric:         isLyric,
        router:          Router,
        createStyle:     createStyle,
    };

}(window, 'NS') );

module.exports = GlobalNamespace;
