document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const equalizerCanvas = document.getElementById('equalizer-canvas');
    const equalizerCtx = equalizerCanvas.getContext('2d');
    const playPauseBtn = document.getElementById('playPauseBtn');

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let isPlaying = false;

    function drawEqualizer() {
    analyser.getByteFrequencyData(dataArray);

    equalizerCtx.clearRect(0, 0, equalizerCanvas.width, equalizerCanvas.height);
    equalizerCtx.lineWidth = 4;
    equalizerCtx.lineCap = 'round';

    const centerX = equalizerCanvas.width / 2;
    const centerY = equalizerCanvas.height / 2;
    const radius = Math.min(equalizerCanvas.width, equalizerCanvas.height) / 2 - 10;

    const maxAmplitude = 256.0;

    for (let i = 0; i < bufferLength / 2; i++) {
        const currentAngle = (i / (bufferLength / 2)) * Math.PI;
        const normalizedAmplitude = dataArray[i] / maxAmplitude;
        const amplitude = normalizedAmplitude * radius;

        const x = centerX + amplitude * Math.cos(currentAngle);
        const y = centerY + amplitude * Math.sin(currentAngle);

        equalizerCtx.strokeStyle = `hsla(${(i / (bufferLength / 2)) * 180}, 100%, 50%, 0.8)`;

        equalizerCtx.beginPath();
        equalizerCtx.moveTo(centerX, centerY);
        equalizerCtx.lineTo(x, y);
        equalizerCtx.stroke();
    }

    for (let i = 0; i < bufferLength / 2; i++) {
        const currentAngle = ((i / (bufferLength / 2)) * Math.PI) + Math.PI;
        const normalizedAmplitude = dataArray[i] / maxAmplitude;
        const amplitude = normalizedAmplitude * radius;

        const x = centerX + amplitude * Math.cos(currentAngle);
        const y = centerY + amplitude * Math.sin(currentAngle);

        equalizerCtx.strokeStyle = `hsla(${180 + (i / (bufferLength / 2)) * 180}, 100%, 50%, 0.8)`;

        equalizerCtx.beginPath();
        equalizerCtx.moveTo(centerX, centerY);
        equalizerCtx.lineTo(x, y);
        equalizerCtx.stroke();
    }
}

    function updateVisualizer() {
        drawEqualizer();
        requestAnimationFrame(updateVisualizer);
    }

    audio.addEventListener('play', () => {
        if (!isPlaying) {
            audioContext.resume().then(() => {
                isPlaying = true;
                updateVisualizer();
            });
        }
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
    });

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = 'P';
        } else {
            audio.pause();
            playPauseBtn.textContent = 'P';
        }
    });
});
