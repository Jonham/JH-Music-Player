var timeRange = $id('time-range'),
    volumeRange = $id('volume-range');


var onTimeRangeUpdate = function() {
    var me = timeRange,
        fill = $(timeRange, '.fill'),
        btn = $(timeRange, '.range-btn');

    var audioPercent = function() {
        var total = audio.duration,
            now   = audio.currentTime;
        return (now/total) *100 + "%";
    };
    var listener = function(e) {
        var per = audioPercent();
        fill.style.width = btn.style.left = per;
    };

    return listener;
};
$on(audio, 'timeupdate', onTimeRangeUpdate());

var RangeClickFactory = function(range, type) {
    // length is a value that given by resizeListener
    var rectRange = range.getBoundingClientRect(),
        left = rectRange.left,
        length = rectRange.width;

    var btn = $(range, '.range-btn'),
        fill = $(range, '.fill');
    var moveto = function(percent) {
        btn.style.left = percent + '%';
        fill.style.width = percent + '%';
    };
    var changeAudioSth = function(per, type) {
        switch (type) {
            case 'time':
                audio.currentTime = audio.duration * per;
            break;
            case 'volume':
                audio.volume = per;
                alert(audio.volume);
            break;
            default:
        }

    };

    var listener = function(e) {
        var point = e.clientX - 5;
        var per = (point - left) / length;//rectTimerange.width;
        per = per < 0?
                0 :
                per > 1?
                    1 :
                    per;
        changeAudioSth(per, type);
        alert(type);
        // what if outside of 0/100 what if resize
    };
    return listener;
};

var timerangelistener = RangeClickFactory(timeRange, 'time');
$click(timeRange, timerangelistener);

var volumerangelistener = RangeClickFactory(volumeRange, 'volume');
$click(volumeRange, volumerangelistener);

var onAudioVolumeChange = function( range, audio ) {
    var btn = $(range, '.range-btn'),
        fill = $(range, '.fill');

    var move = function(percent) {
        btn.style.left = percent + '%';
        fill.style.width = percent + '%';
    };
    var listener = function(e) {
        var a = e.target;
        move(a.volume * 100);
    };
    $on(audio, 'volumechange', listener);
};
onAudioVolumeChange( volumeRange, audio);
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
var onSizeChange = function(e) {
    var divBottom = document.querySelector('div.bottom');
    var lyric = $id('lyric-container'),
        albumDisk = $id('lyric-album').querySelector('span');

    var slowdownTimer; // for reducing listener-invoking times

    var resizeRange = function( callback ) {
        var ct = currentTime.getBoundingClientRect();
        var tt = totalTime.getBoundingClientRect();
        var tr = timeRange.getBoundingClientRect();

        // left | ..OFFSET |<--length-->| OFFSET.. | right
        var left = ct.right;
        var right = tt.left;
        var OFFSET = tr.left - left; // make distance between timeRange the same
        var length = right - left - ( 2*OFFSET );

        timeRange.style.width = length +'px';
        volumeRange.style.width = length + 'px';

        setTimeout( callback, 1100); // transition-duration: 1000
    }; // resizeRange()

    var resizeLyric = function() {
        var rectLyric = lyric.getBoundingClientRect();
        var rectBottom = divBottom.getBoundingClientRect();

        // polyfill : lyric.top return auto...
        var top  = rectLyric.top;
        var bottom = rectBottom.top;
        var height = bottom - top;

        lyric.style.height = height  + "px";
        lyricHightlightOriginTop = height / 2 - 40;
        // albumDisk height 240px 15em
        albumDisk.style.top = (height / 2) - 140 + 'px';
    }; // resizeLyric()

    var listener = function() {
        clearTimeout(slowdownTimer);
        // invoke many times, but only activate 1 second after last invoke
        slowdownTimer = setTimeout(
            function() {
                var callback = function() {
                    $off(timeRange, 'click', timerangelistener);
                    timerangelistener = RangeClickFactory(timeRange, 'time', length); // change when the width time-range change
                    $click(timeRange, timerangelistener);

                    $off(volumeRange, 'click', volumerangelistener);
                    volumerangelistener = RangeClickFactory(volumeRange, 'volume', length);
                    $click(volumeRange, volumerangelistener);
                };

                resizeRange( callback );

                resizeLyric();
        }, 1000); // slowdownTimer
    }; // listener

    return listener;
};

$on(window, 'resize', onSizeChange());
