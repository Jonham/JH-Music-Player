var audioVisualizer = function( height, width, gain ) {

    var ctx = NS.audio.ctx,
        headGain = NS.audio.headGain,
        audioVisualizer = null,
        filledColor = 'rgb(0,0,0)';

    var analyser = ctx.createAnalyser();
    if (gain && gain.connect) { gain.connect(analyser); }
    else { headGain.connect(analyser); }

    var canvas = $('#view-canvas'),
        canvasCtx = canvas.getContext('2d');
    var HEIGHT = canvas.height = height || 200;
    var WIDTH  = canvas.width  = width  || 300;


    analyser.fftSize = 256; // range: [32, 32768]
    var bufferLength = analyser.frequencyBinCount;


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

            canvasCtx.fillStyle = filledColor;
            canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    };

    draw();

    return {
        timer: audioVisualizer,
        analyser: analyser,
        setColor: function(color) { filledColor = color || '#555'; },
        setSize: function(width, height) {
            WIDTH = canvas.width = width;
            HEIGHT = canvas.height = height;
            canvas.style.left = -(WIDTH / 2) + 'px';}
    };
}
