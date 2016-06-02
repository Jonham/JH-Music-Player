var rangeTime = $('#range-time'),
    rangeVolume = $('#range-volume');


var onRangeTimeUpdate = function() {
    var me = rangeTime;

    var audioPercent = function() {
        var total = audio.duration,
            now   = audio.currentTime;
        return  now/total; // return [0, 100]
    };
    var listener = function(e) {
        me.node.rangeTo( audioPercent() );
    };

    $on(audio, 'timeupdate', listener);
};
onRangeTimeUpdate();

// var RangeClickFactory = function(range, type) {
    // length is a value that given by resizeListener
//     var rectRange = range.getBoundingClientRect(),
//         left = rectRange.left,
//         length = rectRange.width;
//
//     var changeAudioSth = function(per, type) {
//         switch (type) {
//             case 'time':
//                 audio.currentTime = audio.duration * per;
//             break;
//             case 'volume':
//                 audio.volume = per;
//             break;
//             default:
//         }
//
//     };
//
//     var listener = function(e) {
//         var point = e.clientX - 5; // get range-btn center point, .range-btn width=10px
//         var per = (point - left) / length; //rectrangeTime.width;
//         per = per < 0?
//                 0 :
//                 per > 1?
//                     1 :
//                     per;
//         changeAudioSth(per, type);
//         // what if outside of 0/100 what if resize
//     };
//     return listener;
// };

// var rangeTimelistener = RangeClickFactory(rangeTime, 'time');
// $click(rangeTime, rangeTimelistener);
//
// var rangeVolumelistener = RangeClickFactory(rangeVolume, 'volume');
// $click(rangeVolume, rangeVolumelistener);

// listen to volume change event and reaction to that
var onAudioVolumeChange = function( range, audio ) {
    var listener = function(e) {
        var a = e.target;
        range.node.rangeTo( a.volume );
    };
    $on(audio, 'volumechange', listener);
};
onAudioVolumeChange( rangeVolume, audio);

var onAudioMute = function( speaker, audio ) {
    var volume = audio.volume;

    var listener = function(e) {
        if (!audio.muted) {
            // set muted
            volume = audio.volume;
            audio.volume = 0;
            audio.muted = true;
        } else {
            audio.volume = volume;
            audio.muted = false;
        }
    };
    $click(speaker, listener);
};
onAudioMute(document.querySelector('#volume .speaker'), audio);

// Resizing Adjustment
var onSizeChange = function() {
    var divBottom = document.querySelector('div.bottom');
    var viewContainer = $id('view-container'),
        albumDisk = $('#view-album').querySelector('span.view-albumCover');

    var slowdownTimer; // for reducing listener-invoking times

    var resizeRange = function( callback ) {
        var ct = tagCurrentTime.getBoundingClientRect();
        var tt = tagTotalTime.getBoundingClientRect();
        var tr = rangeTime.getBoundingClientRect();

        // left | ..OFFSET |<--length-->| OFFSET.. | right
        var left = ct.right;
        var right = tt.left;
        var OFFSET = tr.left - left; // make distance between rangeTime the same
        var length = right - left - ( 2*OFFSET );

        rangeTime.style.width = length +'px';
        rangeVolume.style.width = length + 'px';

        setTimeout( callback, 1100); // transition-duration: 1000
    }; // resizeRange()

    var resizeLyric = function() {
        var rectLyric = viewContainer.getBoundingClientRect();
        var rectBottom = divBottom.getBoundingClientRect();

        // polyfill : lyric.top return auto...
        var top  = rectLyric.top;
        var bottom = rectBottom.top;
        var height = bottom - top;

        viewContainer.style.height = height  + "px";
        lyricHightlightOriginTop = height / 2 - 40;
        // albumDisk height 240px 15em
        albumDisk.style.top = (height / 2) - 140 + 'px';
    }; // resizeLyric()

    var listener = function( e ) {
        // clearTimeout(slowdownTimer);
        // invoke many times, but only activate 1 second after last invoke
        // slowdownTimer =
        setTimeout(
            function() {
                var callback = function() {
                    // $off(rangeTime, 'click', rangeTimelistener);
                    // rangeTimelistener = RangeClickFactory(rangeTime, 'time'); // change when the width time-range change
                    // $click(rangeTime, rangeTimelistener);
                    //
                    // $off(rangeVolume, 'click', rangeVolumelistener);
                    // rangeVolumelistener = RangeClickFactory(rangeVolume, 'volume');
                    // $click(rangeVolume, rangeVolumelistener);
                };
                resizeRange( callback );

                resizeLyric();
        }, 1000); // slowdownTimer
    }; // listener

    return listener;
};
$on(window, 'resize', onSizeChange());
