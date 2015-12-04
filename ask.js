window.onload = function() {
	loadLrc("OneRepublic - Good Life.lrc", parseLrc);
	window.ask = {};
	
	var jh = function(id) {
		return document.querySelector(id);
	},
			lisn = function(obj, act, fn) {
				obj.addEventListener(act, fn, false);
				return true;
			};
			
	var askDiv = jh("div#ask"),
			yesBtn = jh("span.yesBtn"),
			noBtn = jh("span.noBtn");
	
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
		'yes'		: yesBtn,
		'no'		: noBtn
	};
};
