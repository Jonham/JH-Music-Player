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
10. make AJAX audio loading as a alternate plan when user device don't support AudioContext
11. **"Functional HTML DOM Elements"** constructions

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
    - [x] songlist .next, .play, .pause, .stop ...
    - [x] songlist .playNext, .playPre and related songlist.next and songlist.pre
    - [ ] songlist: play-modes, counts
    - [x] song.timeOffset records ctx.currentTime when song begin
    - [x] requestAnimationFrame() to update audio time19. - [ ] open-screen animation :::: need more tests

<hr>
## Bugs need fix

01. main DOM elements display
    - [x] `<input type='file>` display
    - [x] highlight Ranges objects
    - [x] #page-comments needs basic framework setup
04. **dConsole** window display
    - [x] dConsole display when button 'show console' was pressed
    - [ ] display in FullScreen mode. [ change as a float window on the head of viewport]
05. **FullScreen** API
    - [x] FullScreen API for devices
    - [ ] FullScreen Event listeners on other state change
    - [ ] to hide FullScreen button when is not available
06. **Icons** and Display
    - [x] Icons for each Page and Menu items
    - [x] sub-controls bar in #page-system ( btn-play circle display)
    - [ ] zip up _svg_ files of icon
    - [ ] images and icons preload
10. **Events**
    - [x] rangeTime throw error when drag event happened before the audio is playing:SOLUTION:just unbind the function when there is no audio playing
07. **touch** events:
    - [x] cancel browsers default gestures detection ( e.preventDefault, e.stopPropagation )
    - [ ] prevent continuing clicks
    - [ ] wait and react until animations stop
08. **lyric** and cover
    - [x] lyric loader and _timeupdate_ event for AudioContext decoded audio
    - [ ] lyric and album image load when another start
    - [ ] lyric parser for compressed lyric files
    - [ ] lyric Empty lines handling
09. **control** funcs and buttons
    - [x] play, nextSong buttons to work on SongList
    - [x] mute and volume controls on SongList
11. main parts display: Pages, menus, sidebar
    - [x] #sidebar-left bottom position
    - [x] #page-comments .btn-back position to highlight
    - [x] FOR ALL: add max-height or max-width to each
    - [ ] FOR ALL: display style and position when on Desktop
12. **Supports** among browsers
    - [ ] controls in mainpage display in iPhone4 (narrow in width)
    - [ ] supports information for all kind of Browsers
    - [ ] supports for Devices like iPhone or other weak supports of HTML5, to provide a alternate options to load a remote file and lyric to enjoy the player
13. **mask layer**
    - [x] mask layer for avoiding mistake touches and clicks
14. **Integration**
    - [ ] bind up related blocks
