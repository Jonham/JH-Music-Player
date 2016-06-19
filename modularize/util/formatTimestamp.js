//utils: transform time format from 100 to 01:40
var formatTimestamp = function formatTimestamp(time) {
    // current time show like 01:01 under the play&pause button
    var num = parseInt(time),
        sec = num % 60,
        min = parseInt( num / 60);
    var mtTwo = function(n) {
        return n < 0? '00':
                 n < 10? '0'+n: ''+n; }; // more than two digits

    return mtTwo(min) + ":" + mtTwo(sec);
};

module.exports = formatTimestamp;
