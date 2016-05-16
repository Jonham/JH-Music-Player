// Ref: http://www.zhangxinxu.com/wordpress/2013/04/js-mousewheel-dommousescroll-event/
// Ref2: http://www.zhangxinxu.com/study/201304/mousewheel-dommousescroll-same-different.html
// Firefox: Event 'DOMMouseScroll'  and onwheel
//  e.deltaY +3/-3  'wheel'
// Other:   onmousewheel onwheel
//
// wheelDelta
// detail     onwheel时为0
// srcElement target

(function(){
    var ulLrc = $id('scrollLrc');
    // for modern Chrome / Firefox
    var timer;

    ulLrc.onwheel = function(e) {
        e.stopPropagation();
        e.preventDefault();

        var value = e.detail === 0? e.deltaY : e.detail;
        // console.log(value);
        // if (e.target == 'LI') {
            DRAGING = true;
            ulLrc.style.transition = "none"; // take action immediately

            window.clearTimeout(timer);
            timer = window.setTimeout(function(){
                DRAGING = false;
                ulLrc.style.transition = ''; // resume css transition effect
            }, 5000);

            if (value > 0) {
                ulLrc.style.top = parseInt(ulLrc.style.top) - 5 + 'px';
            } else {
                ulLrc.style.top = parseInt(ulLrc.style.top) + 5 + 'px';
            }
        // }

    };
})();
