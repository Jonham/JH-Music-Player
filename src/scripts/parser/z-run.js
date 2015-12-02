var jh = loadLrc("OneRepublic - Good Life.lrc", parseLrc);


var fileList = [
"Adele-Rolling in the Deep.lrc",
"Andrea Bocelli - The Prayer.lrc",
"OneRepublic - Good Life.lrc",
"Rolling.lrc",
"齐秦-火柴天堂.lrc"
];

function test() {
  for (var i = 0; i < fileList.length; i++) {
    loadLrc(fileList[i], parseLrc);
  }
}