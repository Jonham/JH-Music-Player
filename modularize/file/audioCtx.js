var Song = require("./Song/SongClass.js");
var SongList = require("./Song/SongList.js");
// this contains Song(), SongList()
// create
var audioCtx = function() { // Global NameSpace AudioContext Initial
    if (!supportAudioContext()) {
        // alert("WoW! your browser doesn't support the tech: AudioContext.\n我的天！ 你的浏览器居然不支持音频解析，赶紧升级到最新版本!\n或者，你可以尝试用QQ浏览器, Firefox 或者 Chrome浏览器。\n要更好地体验黑科技，建议您使用电脑版的浏览器。");
        alert("WoW! your browser doesn't support the tech: AudioContext.\nFor more joy, please open this player in Destop Browsers.");
        // polyfill NS.audio.ctx...
        return false;
    }

    var ctx = new AudioContext();
    var currentPlayingSong = null;
    var headGain = ctx.createGain(); // this gain works as the headoffice to control all volume of inputs
        headGain.connect(ctx.destination);

    var songlist = new SongList();
    // this works as Center controller
    var controller = {
        play: function() {
            var currentPlayingSong = NS.audio.currentPlayingSong;
            if (currentPlayingSong.PAUSED) {
                currentPlayingSong.play();
            }
            return currentPlayingSong;
        },
        pause: function() {
            var currentPlayingSong = NS.audio.currentPlayingSong;

            NS.audio.currentPlayingSong.pause();
            return currentPlayingSong;
        },
        next: function() {},
        stop: function() {},
        mute: function() {
            headGain.gain.value = 0;
        },
        songEnd: function(song) {
            songlist.playNext();
        },
    };

    return {
        Song: Song(ctx), // Song creator function
        SongList: SongList, // SongList creator function

        ctx: ctx,
        headGain: headGain,
        songlist: songlist,
        currentPlayingSong: currentPlayingSong,
        controller: controller,
    }
};

module.exports = audioCtx;
