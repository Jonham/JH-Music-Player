window.onload = function() {
	loadLrc("OneRepublic - Good Life.lrc", parseLrc);
	window.ask = {};

	var $one = function(id) { return document.querySelector(id); },
		lisn = function(obj, act, fn) { obj.addEventListener(act, fn, false); };

	var askDiv = $one("div#ask"),
		yesBtn = $one("span.yesBtn"),
		noBtn = $one("span.noBtn");

	lisn(yesBtn, "click", function() {
		askDiv.style.display = "none";
		startPlay(true);
	});

	lisn(noBtn, "click", function() {
		askDiv.style.display = "none";
		startPlay(false);
	});

	ask = {
		'window': askDiv,
		'yes'	: yesBtn,
		'no'	: noBtn
	};
};
