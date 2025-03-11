// Music Player with Visualizer
const audioPlayer = document.getElementById("audioPlayer");
const visualizer = document.getElementById("visualizer");
const ctx = visualizer.getContext("2d");

function playSong(song, lyricsFile) {
    audioPlayer.src = song;
    audioPlayer.play();
    loadLyrics(lyricsFile);
    visualizeAudio();
}

// Audio Visualizer
function visualizeAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, visualizer.width, visualizer.height);
        dataArray.forEach((value, i) => {
            ctx.fillStyle = `rgb(${value}, 0, 255)`;
            ctx.fillRect(i * 3, visualizer.height - value, 2, value);
        });
    }
    draw();
}

// Lyrics Viewer
function loadLyrics(file) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            document.getElementById("lyricsText").innerText = text;
        })
        .catch(() => {
            document.getElementById("lyricsText").innerText = "Lyrics not available.";
        });
}

// Interactive Starry Background
const starCanvas = document.getElementById("starCanvas");
const starCtx = starCanvas.getContext("2d");

function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const stars = Array.from({ length: 200 }).map(() => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 2 + 0.5,
}));

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > starCanvas.height) star.y = 0;

        starCtx.fillStyle = "#ffffff";
        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        starCtx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();

// Light/Dark Mode Toggle
document.getElementById("modeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
});
