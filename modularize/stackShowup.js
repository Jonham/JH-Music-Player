// this is a global array that container some callback functions
// that will be invoked when call stackShowup.releaseAll()
var stackShowup = [];
stackShowup.releaseAll = function() {
    while (stackShowup.length) {
        stackShowup.pop()();
    }
};

module.exports = stackShowup;
