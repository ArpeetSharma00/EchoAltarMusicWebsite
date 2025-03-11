document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const trackList = document.getElementById("track-list");
    const canvas = document.getElementById("visualizer");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load and play selected track
    trackList.addEventListener("click", function (e) {
        if (e.target.tagName === "LI") {
            const songSrc = e.target.getAttribute("data-src");
            audio.src = songSrc;
            audio.play();
        }
    });

    // Visualizer effect
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(dataArray);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            const red = barHeight + 100;
            const green = 50;
            const blue = 150 + i * 2;

            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2;
        }

        requestAnimationFrame(animate);
    }

    // Start visualizer on play
    audio.addEventListener("play", () => {
        audioCtx.resume().then(() => {
            animate();
        });
    });
});
