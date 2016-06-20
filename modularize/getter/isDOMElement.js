'use strict';

function isDOMElement(elem) {
    if (typeof(elem) !== 'object') { return false; }

    // var str = elem.toString();
    if (elem.innerHTML !== undefined  && elem.tagName) { return true; }
    return false;
}

module.exports = isDOMElement;
