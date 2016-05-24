// this is a draft need more test
(function(w) {
    // helper functions: private
    var isDOMElement = function(elem) {
        if (typeof(elem) !== 'object') { return false; }

        var str = elem.toString();
        if (str.search('HTML') === 8 && elem.tagName) { return true; }
        return false;
    };
    var toArray = function(o) { return Array.prototype.slice.apply(o); };
    var splitSelectingString = function(str, multiclass) { // todo: multiclass for 'a.jonham#he'
        var spliter = /([^.#]*)?([.#])?(.+)?/;
        var result = spliter.exec(str);
        // empty str
              result.str = result[0];
              result.tag = result[1];
        result.separator = result[2];
            result.value = result[3];

        return result;
    }

    // event listener add and remove
    w.$on = function (elem, method, callback) { return elem.addEventListener(method, callback, false); };
    w.$click = function (elem, callback) { return $on(elem, 'click', callback); };
    w.$off = function (elem, method, callback) { return elem.removeEventListener(method, callback); };

    // getter: DOM elements query
    w.$id = function (id){ return document.getElementById(id); }
    w.$ = function (context, str) {
        var ctx = document;
        var ifOne = function(arr) { return (arr.length && arr.length === 1)? arr[0]: arr;};

        if (typeof(context) === 'object') {
            ctx = context;
        } else {
            ctx = typeof(str) === 'object'? str: ctx;
            var str = context;
        }
        if(document.querySelector && document.querySelectorAll) {
            return ifOne( ctx.querySelectorAll(str) );
        } else {
            var a = splitSelectingString(str);
            switch ( a.separator ) {
                case '#':
                    return ctx.getElementById( a.value );
                case '.':
                    // result fullfil className
                    var oByClass = ctx.getElementsByClassName( a.value );
                    if ( a.tag ) {
                        var arr = toArray(oByCN),
                        tmpDIV = document.createElement('div');
                        arr.forEach(function(v) { tmpDIV.appendChild(v); });
                        // results fullfil tagName
                        oByClass = tmpDIV.getElementsByTagName( a.tag );
                    }

                    return ifOne(oByClass);
                default:
                    return ifOne( ctx.getElementsByTagName( a.tag ) );
            }
        }
    };

    // create: DOM elements create
    w.$dom = function(str, style){
        var a = splitSelectingString(str);
        if (a.tag === '') { return undefined; }

        var elem = document.createElement(a.tag);
        switch (a.separator) {
            case '.':
                if (a.value !== '') { elem.className = a.value; }
                break;
            case '#':
                if (a.value !== '') { elem.id = a.value; }
                break;
            default:
        }

        if (typeof(style) == 'object') {
            for (var index in style) {
                elem.style[ index ] = style[index];
            }
        }
        return elem;
    };

    // debug message on browser
    w.DebugConsole = function( box ){
		if (this === window) { return new debugConsole(box); }

		var me = this;
        me.messageArray = [];
		me.output = null;
		if (isDOMElement(box)) { me.output = box; }

		me.log = function(msg) {
			if (me.output) {
                me.output.innerHTML = msg;
                me.output.style.display = 'inline-block';
            }
            me.messageArray.push(msg);
		};
		me.init = function(newBox) {
			if (!isDOMElement(newBox)) { return false; }
			// remove previous box
			var o = me.output;
			isDOMElement(o)? o.parentNode.removeChild(o): null;

			o = newBox;
		};

        // $on(window, 'error', function(e) {
        //     e.preventDefault();
        //     me.log(e.filename + ":" + e.colno + '>>' + e.message);
        // });
		return this;
	};
})(window);
