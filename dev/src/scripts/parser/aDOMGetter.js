function $id(id){ return document.getElementById(id); }
function $(str, bGetOne) {
    if(document.querySelector && document.querySelectorAll) {
        return bGetOne?
                document.querySelector(str):
                document.querySelectorAll(str);
    } else {
        switch (str.substr(0,1)) {
            case '#':
                return document.getElementById(str.substr(1));
            case '.':
                var oByCN = document.getElementsByClassName(str.substr(1));
                return bGetOne?
                        oByCN[0]:
                        oByCN;
            default:
                var oByTN = document.getElementsByTagName(str.substr(1));
                return bGetOne?
                        oByTN[0]:
                        oByTN;
        }
    }
}
