# JH Music Player

_(formerly known as jh-lrc)_

JH Music Player uses _Modern Browsers_ features like *AudioContext* and *FileReader* to create a web-based music player that can load lyrics, audio, and image files (album covers) from your local file system.    
You can simply drag files to the browser when using desktop browsers, or use the _File-Input button_ to add your files on your mobile devices.    

## About

The current UI design is inspired by one of the most popular music players called 'Cloud Music' from NetEase.    
Icons come from [Material Icons](https://design.google.com/icons/) by Google, and [Octicons](https://github.com/primer/octicons) by GitHub. Generated as font using [IcoMoon App](https://icomoon.io/app).   
_(This project was first started as a lyric file parser and display.)_    

Visit [JH Music Player](http://music.jonham.cn/) to enjoy your music.    
You're welcome to fork this repository and create issues for any suggestions or problems you encounter.

## Planned Features

1. **WebSocket**, with the help of _[Pusher](https://pusher.com/)_: enables **Remote Controls**.
2. Generate music (or sounds) using pure JavaScript (*AudioContext*): DJ music playing platform.
3. Analyze and recognize *beats* and *tones*.
4. Audio recording using **WebRTC** or AudioContext output.
5. Script creation for video or audio: add time tags and improve accuracy.
6. Additional **UI** designs beyond the NetEase style.
7. **Online Engine**: lyric search engine, song information search engine, and album cover search engine.
8. **"Functional HTML DOM Elements"** construction.


## Completed Features

- [x] **Event-Driven** or **State-Driven** mode.
- [x] **Canvas**: visual display of music.
- [x] **History API** for using the browser's back button to navigate between pages and menus.
- [x] **Alternate Plan**: AJAX audio loading as a fallback when user devices don't support AudioContext.

## Features or Functions Needing Tests

### 1. Browser Support
Both WeChat and UC browsers have issues, but with similar error messages:
- [x] WeChat (embedded QQ Browser): auto crashes    
    BUGS: `attachNodeToElement.js:300` [`drag.js:73`](./dev/drag.js)
- [x] UC browser: unique input[type=file], crashes when selecting any kind of files
    BUGS: `attachNodeToElement.js:300` [`drag.js:73`](./dev/drag.js)    
    **Solution**: The crashes on both browsers may be due to unhandled errors. I've caught errors in both rangeTime and rangeVolume.
- [x] `onResize()` doesn't work on browsers that don't support AudioContext

### 2. Song and SongList
- [ ] **!IMPORTANT** SongList issue when playing on mobile devices: file loading takes more time, causing songs to loop between others instead of playing properly
- [x] SongList **mode** detail completion
- [x] Play multiple songs when user clicks .nextSong button multiple times before last song's asynchronous actions are ready
- [x] SongList .next, .play, .pause, .stop functions
- [x] SongList .playNext, .playPre and related songlist.next and songlist.pre
- [x] SongList: play-modes, counts
- [x] song.timeOffset records ctx.currentTime when song begins
- [x] requestAnimationFrame() to update audio time
- [ ] Open-screen animation: needs more tests

### 3. Event System
- [ ] **Event-Driven** Emitter needs to add listenTo or other methods


## Bugs Needing Fixes

### 1. Touch Events
- [x] Cancel browser's default gesture detection (e.preventDefault, e.stopPropagation)
- [ ] Prevent continuing clicks
- [ ] Wait and react until animations stop

### 2. Lyrics and Cover Art
- [x] Lyric loader and _timeupdate_ event for AudioContext decoded audio
- [x] Empty lines handling in lyrics
- [x] Empty lines display: filled with '...'
- [ ] Lyric and album image loading when another starts
- [ ] Lyric parser for compressed lyric files

### 3. Main UI Components
- [x] [#sidebar-left](#sidebar-left) bottom position
- [x] [#page-comments](#page-comments) .btn-back position to highlight
- [x] FOR ALL: add max-height or max-width to each
- [ ] FOR ALL: display style and position when on Desktop

### 4. Integration
- [ ] Bind up related blocks

### 5. Canvas for Audio Visualization
- [ ] Animation delay on poorly supported devices
- [ ] More display styles [black, white]

### 6. History API
- [x] Basic `pushState()` return to [PageSystem](#pagesystem) and close menu or sidebar
- [x] States interruptions: close menu will also return to pageSystem
- [ ] Desktop alt+arrow causes some faults when state overwrites

### 7. Browser Support
- [x] Controls in mainpage display in iPhone4 (narrow in width)
- [ ] Support information for all kinds of browsers
- [ ] Support for devices like iPhone or others with weak HTML5 support, to provide alternate options to load remote files and lyrics

### 8. Alternate Plan
- [x] For devices that don't support importing media files and lyric files (like iPhone)
- [ ] For devices that don't support AudioContext

### 9. FullScreen API
- [x] FullScreen API for devices
- [x] FullScreen event listeners on other state changes
- [x] Hide FullScreen button when not available

### 10. DOM Elements Display
- [x] `<input type='file'>` display
- [x] Highlight Ranges objects
- [x] #page-comments needs basic framework setup

### 11. Debug Console
- [x] dConsole display when button 'show console' is pressed
- [x] Display in FullScreen mode [changed to a float window at the top of viewport]

### 12. Icons and Display
- [x] Icons for each Page and Menu items
- [x] Sub-controls bar in #page-system (btn-play circle display)
- [x] Zip up _svg_ files of icons
- [x] Images and icons preload

### 13. Events
- [x] rangeTime throws error when drag event happens before audio is playing
  - **SOLUTION**: Unbind the function when there is no audio playing

### 14. Control Functions and Buttons
- [x] Play, nextSong buttons to work on SongList
- [x] Mute and volume controls on SongList

### 15. Mask Layer
- [x] Mask layer for avoiding accidental touches and clicks
