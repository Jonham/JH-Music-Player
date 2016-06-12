var mainControls = $('#controls'),
    btnPlay = $(mainControls, '.btn-play'),
    audio = $('audio'),
    tagTotalTime = $('#tag-totalTime'),
    tagCurrentTime = $('#tag-currentTime'),
    lyric = $id('lyric');

window.onload = function() {

    // if window receive 'click' event, it will pop up all callback functions in stackShowup
    $click(window, function(e) {
		NS.stackShowup.releaseAll();
	}, false);

    // history API supports
    $on(window, 'popstate', function(e) {
        var from = NS.util.router.state,
            dest = e.state;

        switch (from) {
            case 'page-main':
                if (dest === 'page-system') { $('#btn-back').click(); }
                var length = history.length;
                history.go(1 - length);
                NS.util.router.push('page-system');
            break;
            case 'page-comments':
                if (dest === 'page-main') {
                    $( $('#page-comments'),'.btn-back').click(); }
            break;
            default:
                NS.stackShowup.releaseAll();
        }

        // console.log('From: ' + from + "==> " + dest);
        NS.util.router.state = dest;
    });
    // pushState on Where we are
    // init history: page-system as init page
    NS.util.router.push('page-system');

    onSizeChange()();
	onFileLoad();
    NS.audio.visualizer = audioVisualizer();
};
