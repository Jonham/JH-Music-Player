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
};
window.addEventListener('resize', onSizeChange, false);

onSizeChange();
