var timeRange = $id('time-range'),
    volumeRange = $id('volume-range');

// for debug
var log = function(msg) { console.log(msg); };

var onTimeRangeUpdate = function() {
    var me = timeRange,
        fill = timeRange.querySelector('.fill'),
        btn = timeRange.querySelector('.range-btn');

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
audio.addEventListener('timeupdate', onTimeRangeUpdate(), false);

var RangeClickFactory = function(range, type) {
    // length is a value that given by resizeListener
    var rectRange = range.getBoundingClientRect(),
        left = rectRange.left,
        length = rectRange.width;

    var btn = range.querySelector('.range-btn'),
        fill = range.querySelector('.fill');

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
        moveto(per * 100);  // move btn and extend fill
        changeAudioSth(per, type);
        // what if outside of 0/100 what if resize
    };

    return listener;
};

var timerangelistener = RangeClickFactory(timeRange, 'time');
timeRange.addEventListener('click', timerangelistener, false);

var volumerangelistener = RangeClickFactory(volumeRange, 'volume');
volumeRange.addEventListener('click', volumerangelistener, false);

// Resizing Adjustment
var onSizeChange = function(e) {
    var divBottom = document.querySelector('div.bottom');
    var lyric = $id('lyric-container'),
        album = $id('lyric-album').querySelector('span');

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
        album.style.top = (height / 2) - 120 + 'px';
    }; // resizeLyric()

    var listener = function() {
        clearTimeout(slowdownTimer);
        // invoke many times, but only activate 1 second after last invoke
        slowdownTimer = setTimeout(
            function() {
                var callback = function() {
                    timeRange.removeEventListener('click', timerangelistener);
                    timerangelistener = RangeClickFactory(timeRange, 'time', length); // change when the width time-range change
                    timeRange.addEventListener('click', timerangelistener, false);

                    volumeRange.removeEventListener('click', volumerangelistener);
                    volumerangelistener = RangeClickFactory(volumeRange, 'volume', length);
                    volumeRange.addEventListener('click', volumerangelistener, false);
                };

                resizeRange( callback );

                resizeLyric();
        }, 1000); // slowdownTimer
    }; // listener

    return listener;
};

window.addEventListener('resize', onSizeChange(), false);
