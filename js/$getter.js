// this is a draft need more test
(function(w) {
    w.$id = function (id){ return document.getElementById(id); }
    w.$on = function (elem, method, callback) { return elem.addEventListener(method, callback, false); };
    w.$click = function (elem, callback) { return $on(elem, 'click', callback); };
    w.$off = function (elem, method, callback) { return elem.removeEventListener(method, callback); };
    w.$ = function (context, str) {
        var ctx = document;
        if (typeof(context) === 'object') {
            ctx = context;
        } else {
            var str = context;
        }
        if(document.querySelector && document.querySelectorAll) {
            var result = ctx.querySelectorAll(str);

            return result.length === 1? result[0]: result;
        } else {
            var spliter = /([^.#]*)?([.#])?(.+)?/;
            var result = spliter.exec(str),
                all = result[0];
            // empty str
            if (all == '') { return undefined; }

            var tag         = result[1],
                separator   = result[2],
                value       = result[3];
            switch ( separator ) {
                case '#':
                    return ctx.getElementById( value );
                case '.':
                    // result fullfil className
                    var oByClass = ctx.getElementsByClassName( value );
                    if (tag) {
                        var arr = Array.prototype.slice.apply(oByCN),
                        tmpDIV = document.createElement('div');
                        arr.forEach(function(v) { tmpDIV.appendChild(v);});
                        // results fullfil tagName
                        oByClass = tmpDIV.getElementsByTagName( tag );
                    }

                    return oByClass.length === 1? oByClass[0]: oByClass;
                default:
                    var oByTag = ctx.getElementsByTagName( tag );
                    return oByTag.length === 1? oByTag[0]: oByTag;
            }
        }
    }
})(window);
