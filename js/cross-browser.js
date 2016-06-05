// XMLHttpRequest object polyfill
if (window.XMLHttpRequest === undefined) {
	window.XMLHttpRequest = function() {
		try {
			// ActiveX Newest Version
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		}
		catch (e1) {
			try {
				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
			}
			catch (e2) {
				throw new Error("XMLHttpRequest is not supported");
			}
		}
	};
}

if (!window.AudioContext) {
	window.AudioContext = window.webkitAudioContext;
}

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
    var lastTime = 0;
    var vendors = ['moz', 'webkit'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
})();
