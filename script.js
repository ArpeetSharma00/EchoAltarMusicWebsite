document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");

    audio.addEventListener("play", function () {
        document.body.style.filter = "hue-rotate(20deg)";
    });

    audio.addEventListener("pause", function () {
        document.body.style.filter = "none";
    });
});
