// drag
// dragstart dragend dragover dragenter dragleave
// drop
function addDragEventsTo( range ) {
    if (!$.isDOMElement(range)) { return false; }
    if (this === window) { return new addDragEventsTo(range); }

    var parsePercent = function(percent) { return parseFloat(percent) / 100; };
    // private, short-handed
    var range = range;
        // this method bind up both range-btn and range-fill
        // change both range-fill width and range-btn left
    var rangeTo = range.node.rangeTo;
    var change = range.node.change;
    var btn = $(range, '.range-btn');
    var initPercent = parsePercent( btn.style.left );
    var o = {
        width: 0,
        percent: initPercent,  // range: [0, 1]
        clientX: 0
    };

    // also private, but public
    this._btn = btn;
    this._range = range;
    this._change = change;
    this._rangeTo = rangeTo;
    this._oStart = o;

    var mobileOrDestop = function() {
        // return true for mobile
        return _.isNull(document.ontouchend);
    };
    var Events = (function(mobile) {
        dConsole.debug('Events: ' + mobile);
        if (mobile) {
            dConsole.debug('Events: mobile mode>> touch;');
            return {
                start: 'touchstart',
                move:  'touchmove',
                end:   'touchend'
            };
        } else {
            dConsole.debug('Events: desktop mode>> mouse;');
            return {
                start: 'mousedown',
                move:  'mousemove',
                end:   'mouseup'
            };
        }
    })( mobileOrDestop() );
    var getX = (function(mobile) {
        dConsole.debug('GetX: ' + mobile);
        if (mobile) {
            return function(e, end) {
                return end === 'end'? e.changedTouches[0].clientX: e.touches[0].clientX;
            };
        } else {
            return function(e) {
                return e.clientX;
            };
        }
    })( mobileOrDestop() );

    var moveListener = function(e) {
        var offset = getX(e) - o.clientX; // using clientX get horizontal offset
        var offsetPercent = parseFloat( offset/o.width );
        var totalPercent = o.percent + offsetPercent;   // [0,1]

        var leftPercent = totalPercent < 0? 0:
                             totalPercent > 1? 1: totalPercent;
        rangeTo(leftPercent);
        change(leftPercent);
    };
    var upListener = function(e) {
        var offset = getX(e, 'end') - o.clientX; // using clientX get horizontal offset
        var offsetPercent = parseFloat( offset/o.width );
        var totalPercent = o.percent + offsetPercent;

        var leftPercent = totalPercent < 0? 0:
                            totalPercent > 1? 1: totalPercent;

        rangeTo(leftPercent);
        change(leftPercent);

        o.leftPercent = leftPercent;

        $off(window, Events.move, moveListener);
        $off(window, Events.end, upListener);
    };
    var downListener = function(e) {
        o.clientX = getX(e);
        o.width = range.getBoundingClientRect()['width'];
        o.percent = parsePercent( btn.style.left || '100%' ); // [0,1]

        $on(window, Events.move, moveListener);
        $on(window, Events.end, upListener);
    };

    // attach downListener on range
    $on(range, Events.start, downListener);
    // dConsole.debug(range.id + 'mousedown');
    return this;
};

NS.ranges = {};
NS.ranges.time = new addDragEventsTo(rangeTime);
NS.ranges.volume = new addDragEventsTo(rangeVolume);
