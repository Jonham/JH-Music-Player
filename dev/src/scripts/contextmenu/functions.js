var contextMenuListener = function(e) {
    var lrc = loadedLRClist[0];
	var timeline = lrc.timeTags;
	var lrcList = lrc.lrc;
    var ulLrc = $id('scrollLrc');

    if (e.target.tagName == "LI") {
        e.stopPropagation();
        e.preventDefault();

        var line = e.target.dataset.line;
        audio.currentTime = timeline[line] - 0.5;
        DRAGING = false;

        // clear any 'focus' value in class
        var domFocus = ulLrc.querySelectorAll('.focus');
        for (var i = 0, len = domFocus.length; i < len; i++) {
            domFocus[i].className = 'line';
        }
    }
};
