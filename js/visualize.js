var v = function( height, width, gain ) {

    var ctx = NS.audio.ctx,
        headGain = NS.audio.headGain;

    var analyser = ctx.createAnalyser();
    if (gain && gain.connect) {
        gain.connect(analyser);
    } else {
        headGain.connect(analyser);
    }

    var canvas = $('#view-canvas'),
        canvasCtx = canvas.getContext('2d');
    var HEIGHT = canvas.height = height || 200;
    var WIDTH  = canvas.width  = width  || 300;


    analyser.fftSize = 128; // range: [32, 32768]
    var bufferLength = analyser.frequencyBinCount;
    // console.log("bufferLength: " + bufferLength);


    var dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
        drawVisual = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        // draw background
        // canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = 'rgb(0,0,0)';
            // canvasCtx.fillStyle = 'rgb(' + (255 - barHeight) + ',' + (255 - barHeight) + ',' + (255 -barHeight) +')';
            // canvasCtx.fillRect(x, 0, barWidth, barHeight / 2);
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    };

    draw();
}
