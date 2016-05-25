// contains all GLOBAL objects, do not exposed directly to window
(function(w) {
    w.NS = {};
    // add anything you like under NS.something
    //==> declare at the beginning of this file,
    //==> add to NS at the bottom
    var LocalFileList = function() {
        var FileContainer = function() {
            this._array = [];
            return this;
        };
        FileContainer.prototype = {
            add: function(str) { this._array.push(str); return this; },
            remove: function(str) {
                var a = this._array;
                this._array = _.filter(a, // remove those equal to str 
                    function(value){ return value !== str; });
                return this;
            },
            length: function() { return this._array.length; }
        };

        this.audio =  new FileContainer();
        this.image =  new FileContainer();
        this.lyric =  new FileContainer();

        // this _tree records all
        this._tree = [];
        return this;
    };
    LocalFileList.prototype = {
        AUDIO : 0,
        LYRIC : 1,
        IMAGE : 2,

        add: function(file, type) {
            switch ( type ) {
                case this.AUDIO:
                    this.audio.add(file);
                    var index = this.audio.length - 1;
                    break;
                default:

            }
        }
    };


    // adding to w.NS;
    var ns = w.NS;
    ns.localfilelist = new LocalFileList();
})(window);
