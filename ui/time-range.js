var timeRange = $id('time-range');

var onTimeRangeScroll = function() {
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

audio.addEventListener('timeupdate', onTimeRangeScroll(), false);

timeRange.addEventListener('click', function(e) {
    alert('AllCH! Don\'t touch me.');
}, false);

// auto addLength
var onSizeChange = function(e) {
    var cS = getComputedStyle( currentTime );
    var tS = getComputedStyle( totalTime );

    var left = parseInt(cS['left']) + parseInt(cS['width']);
    var right = parseInt(tS['left']);
    var OFFSET = 20;
    var length = right - left - OFFSET + 'px';
    timeRange.style.width = length;

    // lyric and album resize
    var b = document.querySelector('div.bottom');
    var lyric = $id('lyric-container');

    var bS = getComputedStyle( b );

    // polyfill : lyric.top return auto...
    var top  = 80;//parseInt( lS['top'] );
    var bottom = parseInt( bS['top'] );

    var height = bottom - top - 20 + "px";
    lyric.style.height = height;
};
window.addEventListener('resize', onSizeChange, false);

onSizeChange();
