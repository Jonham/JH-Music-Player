// desktop browsers don't support touch events
var isMobile = function() { return null === document.ontouchend; };
// another way: not completed
var isMobile1 = function() {
    var ug = navigator.userAgent;
    var result = ug.search(/windows|x11|Mac.*(^iphone)/ig);
    dConsole.log(result === -1? 'Use input[type=file] to add files' : 'Drag&Drop files onto me!');
    // return true if userAgent fulfill desktop-browser conditions
    //   and browser support AudioContext() [webkitAudioContext() included]
    return NS.supports.audioContext && result !== -1;
};

module.exports = isMobile;
