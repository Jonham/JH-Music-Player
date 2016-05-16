
var contextMenuListener = function(e) {
    var lrc = loadedLRClist[0];
	var timeline = lrc.timeTags;
	var lrcList = lrc.lrc;

    if (e.target.tagName == "LI") {
        e.stopPropagation();
        e.preventDefault();
        var line = e.target.dataset.line;
        console.log(line);
        console.log(lrcList[line]);
        audio.currentTime = timeline[line] - 0.5;
    }
};

var contextMenuElement = $id('scrollLrc');
contextMenuElement.addEventListener('contextmenu', contextMenuListener, false);
