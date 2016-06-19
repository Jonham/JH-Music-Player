var _ = require('../lib/underscore-min.js');
//utils: preloadImage
var preloadImage = function( urlArray, loadedCallback ) {
    if (!_.isArray(urlArray)) { return false; }

    var startTime = +new Date(), success = [], fail = [];
    var process = function(index) {
        if (index === urlArray.length - 1) {
            dConsole.log('Images loaded: success x ' + success.length + "|| fail x " + fail.length);

            loadedCallback && loadedCallback();
        }
    };
    _.each( urlArray ,function(url, index) {
        var i = new Image();
        i.src = url;
        i.onload = function() {
            success.push({
                url: url,
                time: +new Date()
            });
            process(index);
        };
        i.onerror = function(e) {
            fail.push({
                url: url,
                time: +new Date()
            });
        };
    });
};

module.exports = preloadImage;
