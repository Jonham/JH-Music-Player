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

    var moveListener = function(e) {
        // dConsole.debug('moveListener' + new Date());
        var offset = e.clientX - o.clientX; // using clientX get horizontal offset
        var offsetPercent = parseFloat( offset/o.width );
        var totalPercent = o.percent + offsetPercent;   // [0,1]

        var leftPercent = totalPercent < 0? 0:
                             totalPercent > 1? 1: totalPercent;
        rangeTo(leftPercent);
        change(leftPercent);
    };
    var upListener = function(e) {
        var offset = e.clientX - o.clientX; // using clientX get horizontal offset
        var offsetPercent = parseFloat( offset/o.width );
        var totalPercent = o.percent + offsetPercent;

        var leftPercent = totalPercent < 0? 0:totalPercent > 1? 1: totalPercent;

        rangeTo(leftPercent);
        change(leftPercent);

        o.leftPercent = leftPercent;

        $off(window, 'mousemove', moveListener);
        $off(window, 'mouseup', upListener);
    };
    var downListener = function(e) {
        o.clientX = e.clientX;
        o.width = range.getBoundingClientRect()['width'];
        o.percent = parsePercent( btn.style.left || '100%' ); // [0,1]

        $on(window, 'mousemove', moveListener);
        $on(window, 'mouseup', upListener);
    };

    // attach downListener on range
    $on(range, 'mousedown', downListener);
    // dConsole.debug(range.id + 'mousedown');
    return this;
};

addDragEventsTo.prototype = {
    update: function() {}
};

NS.ranges = {};
NS.ranges.time = new addDragEventsTo(rangeTime);
NS.ranges.volume = new addDragEventsTo(rangeVolume);
