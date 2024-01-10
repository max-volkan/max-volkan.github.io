const songs = [
  "./radio-song-crate-1/++.290.9109.19XXXXXXXXX.mp3",
  "./radio-song-crate-1/BeatPortfolio2 [c-lips].mp3",
  "./radio-song-crate-1/friday.mp3",
  "./radio-song-crate-1/hauntme.mp3",
  "./radio-song-crate-1/in the night.mp3",
  "./radio-song-crate-1/metgaler throwaway.mp3",
  "./radio-song-crate-1/outnabout.mp3",
  "./radio-song-crate-1/slowly, but surely.mp3",
  "./radio-song-crate-1/termination w orenji soul..mp3",
  "./radio-song-crate-1/THRUYASYSTEM!!!!!!.mp3",
  // Add all your songs here
];

let currentSongIndex = 0;
const player = document.getElementById('audio-player');

function loadSong(songIndex) {
    player.src = songs[songIndex];
    player.play();
}

player.addEventListener('ended', function() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }
    loadSong(currentSongIndex);
});

// Load the first song initially
loadSong(currentSongIndex);