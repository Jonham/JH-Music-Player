var Router = (function() {
    var Router = function() {
        var me = this;
        me.state = null;
        me.push = function( page ) {
            if (page === '' + page) {
                history.pushState(page, null);
                me.state = page;
            }
        };
        return me;
    };
    return new Router();
}());

module.exports = Router;
