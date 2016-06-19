var LocalFileList = function() {

    // FileContainer will store the true data
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

    // Index Tree store all file related message and index to each subtree
    var IndexTree = function() {
        // name artist album
        this._tree = {};
        return this;
    };
    IndexTree.prototype = {
        add: function(file, group, index) {
            var name = file.name,
                size = file.size,
                tree = this._tree;

            if (tree[name] && tree[name].size === size) { // already load one: JH-bugs: sizes
                dConsole.log("skip " + name + ": already had one.");

                return false;
            }// already load one
            else if( tree[name] ) { // with different size, as a new object, name end with #i
                // JH-bugs: here should count all file, that share a same name and compare their size
                var num = tree[name].count;
                if (typeof(num) === 'number') {
                    tree[ name + '#' + (++num)] = {
                        name: name,
                        num: num, // the number of this in those songs share the name
                        size: size,
                        group: group,
                        index: index
                    };
                    return true;
                }
                else { // this maybe the second one
                    num = 1;
                    tree[ name ].count = 2;
                    tree[ name ].num = num;
                    tree[ name + '#' + (++num)] = {
                        name: name,
                        num: num, // the number of this in those songs share the name
                        size: size,
                        group: group,
                        index: index
                    };
                    return true;
                }
            } // different size
            else { // this is the first one on this name
                tree[ name ] = {
                    name: name,
                    size: size,
                    group: group,
                    index: index
                };
                return true;
            }
        },
        set: function() {},
        get: function() {},
        remove: function() {},
    };
    this.audio =  new FileContainer();
    this.lyric =  new FileContainer();
    this.image =  new FileContainer();

    // this _tree records all
    this._treeTitle = {};
    this._treeArtist = {};
    this._treeAlbum = {};

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
            case this.LYRIC:
                this.lyric.add(file);
                var index = this.audio.length - 1;
                break;
            case this.IMAGE:
                this.image.add(file);
                var index = this.audio.length - 1;
                break;
            default:

        }
    }
};

module.exports = LocalFileList;
