

(function(){
    var ulLrc = $id('scrollLrc');

    var startP = {x: 0, y: 0};
    var lrcDraging = function(e) {
        if (e.button !== 0) return; // only works when left button is click
        e.preventDefault();
        e.stopPropagation();
        var offset = {
            x: e.clientX - startP.x,
            y: e.clientY - startP.y
        };
        ulLrc.style.top = startP.lrcOffset + offset.y + "px";
        // console.log(DRAGING);
    };
    var lrcDragStart = function(e) {
        if (e.button !== 0) return; // only works when left button is click
        e.preventDefault();
        e.stopPropagation();
        if (e.target.tagName != 'LI') return;

        startP.lrcOffset = parseInt( ulLrc.style.top );
        startP.x = e.clientX;
        startP.y = e.clientY;

        document.addEventListener('mousemove', lrcDraging, false);
        DRAGING = true;
        ulLrc.style.transition = "none";
    };
    var lrcDragEnd = function(e) {
        if (e.button !== 0) return; // only works when left button is click
        e.preventDefault();
        e.stopPropagation();
        // if (e.originalTarget.tagName != 'LI') return;

        var offset = {
            x: e.clientX - startP.x,
            y: e.clientY - startP.y
        };
        if (DRAGING) {
            document.removeEventListener('mousemove', lrcDraging, false);
            DRAGING = false;
            ulLrc.style.transition = '';
        }

        window.jh = e;
        console.log('mouseup');
    };

    ulLrc.addEventListener('mousedown', lrcDragStart, false);
    document.addEventListener('mouseup',   lrcDragEnd,   false);
})();
