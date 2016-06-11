window.onload = function() {

    // if window receive 'click' event, it will pop up all callback functions in stackShowup
    $click(window, function(e) {
		NS.stackShowup.releaseAll();
	}, false);

    // history API supports
    $on(window, 'popstate', function(e) {
        var state = NS.util.router.state,
        dest = e.state;

        switch (state) {
            case 'page-main':
            if (dest === 'page-system') { $('#btn-back').click(); }
            break;
            default:
            NS.stackShowup.releaseAll();
        }

        // console.log('state: ' + state + "  dest: " + dest);
        NS.util.router.state = dest;
    });
    // pushState on Where we are
    NS.util.router.push('page-system');

    onSizeChange()();
	onFileLoad();

};
