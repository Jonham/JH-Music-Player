window.onload = function() {
    var aImageURL = [
        'style/icons/favorited-w.svg',
        'style/icons/mode-loop-w.svg',
        'style/icons/mode-repeatone-w.svg',
        'style/icons/mode-shuffle-w.svg',
    ];
    NS.util.preloadImage(aImageURL);


    // if window receive 'click' event, it will pop up all callback functions in stackShowup
    $click(window, function(e) {
		NS.stackShowup.releaseAll();
	}, false);

    onSizeChange()();
	onFileLoad();
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
						'favorite btnToggle':
						'favorited btnToggle';
						// favorite.classList.toggle('favorite');
						// favorite.classList.toggle('favorited');
				favoriteState = !favoriteState;
			},
		onCommentsClick = function(e) {
				e.stopPropagation();
				dConsole.log('show comments');
				commentsCount.innerHTML = 99;
			};

	// add listener on their parent and switch on e.target
	$click(favorite, onFavoriteClick);
	$click(btnComments, onCommentsClick);
};
onSongOptionsGroup();
