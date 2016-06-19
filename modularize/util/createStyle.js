var createStyle = (function(){
    var CreateStyleTag = function() {
        var me = this;

        me.tags = [];
        me.createTag = function( content ) {
            me.tags.push(content);
            return me;
        };
        me.insert = function() {
            var tag = document.createElement('style');
            tag.innerHTML = me.tags.join('');
            document.body.appendChild(tag);
            return me;
        };

        return me;
    };

    return new CreateStyleTag();
}());

module.exports = createStyle;
