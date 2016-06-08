var list = NS.audio.songlist;
list.init();
NS.dom.menuSonglist.node.bind( list );
var lyric = NS.lyric;

var script = $dom('script');
script.src = './js/visualize.js';
document.body.appendChild(script);
script.onload = function() { v(); };
