// parse lrc into Array Object
// Example
//[ti:Rolling In The Deep]
//[ar:Adele]
//[al:21]
//[by:yvonne]
//
function parseLrc(str) {
    var rg = /[\[\]]/g;
    var arr = str.split(rg);
    var aOut = [];

    for (var i =0; i < arr.length; i++) {
        // mutiline of "\n"
        var sTMP = arr[i];
        sTMP.replace("\n", "");
        aOut.push(sTMP);
    }
    return classifyLrc(aOut);
}
