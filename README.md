# JH Music Player _(jh-lrc)_
JH Music Player use _Modern Browsers_ feature *AudioContext* and *FileReader* to make a web-base music player that can load lyric, audio, image[album cover] files from local file system.    
You can simply drag files to the browser when you're using desktop browsers, or use _File-Input button_ to add your files on your phones.     

Its current UI design is imitating one of the most popular music players called 'Cloud Music' from NetEase.    
Its most icons come from [Material Icons](https://design.google.com/icons/) by Google.   
_(this project was first started as a lyric file parser and display.)_    

visit [JH Music Player](http://music.jonham.cn/) (http://music.jonham.cn/) to enjoy your music.    
And you're welcome to fork and issue whatever come up in your mind.

<hr>
## Features going to add
1. **WebSocket**, with the help of _[Pusher](https://pusher.com/)_: makes **Remote Controls**.
2. **Canvas**: visual display of music.
3. generate music (or noises) by pure JavaScript (*AudioContext*): DJ music playing platform
4. analyse and regnize *beats* and *tones*.
5. Audio recording using **WebRTC** or AudioContext output
6. scripts making to Video or audio: add time tags and fix accuration.
7. some other UI besides NetEase one.
8. **History API** for using return button on browsers to route between each page and menu
9. lyric search Engine or Song message search Engine, further album cover search engine


<hr>
## Features or Functions need tests
01. **Supports for Browsers**: both Wechat and UC won't crack, but with same error message
    - [ ] Wechat(enbeded QQ Browser): auto crack down    
        BUGS: attachNodeToElement.js:300 drag.js:73
    - [ ] UC browser : unique input[type=file], crack down when select any kind of files
        BUGS: attachNodeToElement.js:300 drag.js:73    
    **Solution**: the crack down on both browser may due to the fact that browser receive unhandled errors.
    I've catch errors both in rangeTime and rangeVolume.
02. **Song** and **SongList**
    - [ ] songlist .next, .play, .pause, .stop ...

<hr>
## Bugs need fix
01. touch events:
    - [ ] cancel browsers default gestures detection.    
    ( e.preventDefault, e.stopPropagation )
02. - [x] `<input type='file>` display
03. - [ ] lyric loader and _timeupdate_ event for AudioContext decoded audio
04. - [x] highlight Ranges objects
05. - [x] dConsole display
06. - [x] FullScreen API for devices
07. - [ ] Icons for each Page and Menu items
08. - [ ] mask layer for avoiding mistake touches and clicks
09. - [ ] bind up related blocks
10. - [ ] images and icons preload
11. - [ ] songlist: play-modes, counts
12. - [ ] prevent continuing clicks
13. - [ ] play, nextSong buttons to work on SongList
14. - [ ] mute and volume controls on SongList
15. - [ ] wait and react until animations stop
16. - [ ] zip up _svg_ files of icon
17. - [ ] rangeTime throw error when drag event happened before the audio is playing
18. - [ ] #page-comments needs basic framework setup
19. - [ ] drag rangeTime and set value to undefined audio throw errors