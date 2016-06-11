window.onload = function() {
    // var aImageURL = [
    //     'style/icons/favorited-w.svg',
    //     'style/icons/mode-loop-w.svg',
    //     'style/icons/mode-repeatone-w.svg',
    //     'style/icons/mode-shuffle-w.svg',
    // ];
    // NS.util.preloadImage(aImageURL);


    // if window receive 'click' event, it will pop up all callback functions in stackShowup
    $click(window, function(e) {
		NS.stackShowup.releaseAll();
	}, false);

    onSizeChange()();
	onFileLoad();

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

        console.log('state: ' + state + "  dest: " + dest);
        NS.util.router.state = dest;
    });
    // pushState on Where we are
    NS.util.router.push('page-system');
};

var onSongOptionsGroup = function() {
    var wrapper = $('span.song-opt-grp'),
        favorite = $(wrapper, '#btnFavorite'),
        btnComments = $(wrapper, '.btn-comments'),
        	commentsCount = $(btnComments, 'span');

	var favoriteState = false,
		onFavoriteClick = function(e) {
				e.stopPropagation();
				favorite.className =
					favoriteState ?
						'favorite icon icon-favorite_border':
						'favorited icon icon-favorite';
						// favorite.classList.toggle('favorite');
						// favorite.classList.toggle('favorited');
				favoriteState = !favoriteState;
			},
		onCommentsClick = function(e) {
				e.stopPropagation();
				// commentsCount.innerHTML = 99;
			};

	// add listener on their parent and switch on e.target
	$click(favorite, onFavoriteClick);
	$click(btnComments, onCommentsClick);
};
onSongOptionsGroup();
