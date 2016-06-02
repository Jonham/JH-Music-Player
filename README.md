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
    - [x] Wechat(enbeded QQ Browser): auto crack down    
        BUGS: attachNodeToElement.js:300 drag.js:73
    - [x] UC browser : unique input[type=file], crack down when select any kind of files
        BUGS: attachNodeToElement.js:300 drag.js:73    
    **Solution**: the crack down on both browser may due to the fact that browser receive unhandled errors.
    I've catch errors both in rangeTime and rangeVolume.
02. **Song** and **SongList**
    - [ ] songlist .next, .play, .pause, .stop ...

<hr>
## Bugs need fix
02. - [x] `<input type='file>` display
04. - [x] highlight Ranges objects
18. - [x] #page-comments needs basic framework setup
05. dConsole window display
    - [x] dConsole display when button 'show console' was pressed
    - [ ] display in FullScreen mode. [ change as a float window on the head of viewport]
06. FullScreen API
    - [x] FullScreen API for devices
    - [ ] FullScreen Event listeners on other state change
    - [ ] to hide FullScreen button when is not available
07. Icons and Display
    - [x] Icons for each Page and Menu items
    - [ ] sub-controls bar in #page-system ( btn-play circle display)
    - [ ] zip up _svg_ files of icon
01. touch events:
    - [ ] cancel browsers default gestures detection ( e.preventDefault, e.stopPropagation )
    - [ ] prevent continuing clicks
    - [ ] wait and react until animations stop
03. lyric and cover
    - [ ] lyric loader and _timeupdate_ event for AudioContext decoded audio
    - [ ] lyric and album image load when another start
00. control funcs and buttons
    - [ ] play, nextSong buttons to work on SongList
    - [ ] mute and volume controls on SongList
00. Events
    - [ ] rangeTime throw error when drag event happened before the audio is playing
00. Pages, menus, sidebar display
    - [ ] #sidebar-left bottom position
    - [ ] #page-comments .btn-back position to highlight
    - [ ] FOR ALL: add max-height or max-width to each
    - [ ] FOR ALL: display style and position when on Desktop
08. - [ ] mask layer for avoiding mistake touches and clicks
09. - [ ] bind up related blocks
10. - [ ] images and icons preload
11. - [ ] songlist: play-modes, counts
19. - [ ] drag rangeTime and set value to undefined audio throw errors
20. - [ ] controls in mainpage display in iPhone4 (narrow in width)
21. - [ ] supports information for all kind of Browsers
22. - [ ] open-screen animation
