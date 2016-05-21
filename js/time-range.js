var timeRange = $id('time-range'),
    volumeRange = $id('volume-range');

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

var onTimeRangeClick = function() {
    var rectTimerange = timeRange.getBoundingClientRect();
    var btn = timeRange.querySelector('.range-btn'),
        fill = timeRange.querySelector('.fill');

    var moveto = function(percent) {
        btn.style.left = percent + '%';
        console.log(btn.style.left);
        fill.style.width = percent + '%';
        console.log(fill.style.width);
    };
    var listener = function(e) {
        jh = e;
        var per = (e.clientX - 5 - rectTimerange.left) / rectTimerange.width;
        moveto(per * 100); // what if outside of 0/100
        console.log(per * 100);
    };
    return listener;
};
timeRange.addEventListener('click', onTimeRangeClick(), false);


// Resizing Adjustment
var onSizeChange = function(e) {
    var divBottom = document.querySelector('div.bottom');
    var lyric = $id('lyric-container'),
        album = $id('lyric-album').querySelector('span');

    var slowdownTimer; // for reducing listener-invoking times

    var resizeRange = function() {
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
        slowdownTimer = setTimeout(function(){
            resizeRange();
            resizeLyric();
        }, 1000); // slowdownTimer
    }; // listener

    return listener;
};
window.addEventListener('resize', onSizeChange(), false);
