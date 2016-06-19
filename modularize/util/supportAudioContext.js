// AudioContext
var supportAudioContext = function() {
    // JH-debuging make browser act like mobile one which support no AudioContext
    // return false;
    return !!window.AudioContext;
};

module.exports = supportAudioContext;
