const songs = [
  "radio-song-crate-1/++.290.9109.19XXXXXXXXX.mp3",
  "radio-song-crate-1/BeatPortfolio2 [c-lips].mp3",
  "radio-song-crate-1/friday.mp3",
  "radio-song-crate-1/hauntme.mp3",
  "radio-song-crate-1/in the night.mp3",
  "radio-song-crate-1/metgaler throwaway.mp3",
  "radio-song-crate-1/outnabout.mp3",
  "radio-song-crate-1/slowly, but surely.mp3",
  "radio-song-crate-1/termination w orenji soul..mp3",
  "radio-song-crate-1/THRUYASYSTEM!!!!!!.mp3",
  // Add all your songs here
];

let currentSongIndex = 0;
const player = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const currentTrack = document.getElementById('current-track');
const volumeControl = document.getElementById('volume-control');

// Load song and update track info
function loadSong(songIndex) {
  const songPath = songs[songIndex];
  player.src = songPath;

  // Use jsmediatags to read metadata
  jsmediatags.read(songPath, {
      onSuccess: function (tag) {
          const tags = tag.tags;
          const artist = tags.artist || "Unknown Artist";
          const title = tags.title || "Unknown Title";

          // Update caption and current track text
          document.getElementById('track-caption').textContent = `${title} - ${artist}`;
          currentTrack.textContent = `${title} - ${artist}`;

          // Display cover art if available
          if (tags.picture) {
              let base64String = "";
              for (let i = 0; i < tags.picture.data.length; i++) {
                  base64String += String.fromCharCode(tags.picture.data[i]);
              }
              const imageUrl = "data:" + tags.picture.format + ";base64," + window.btoa(base64String);
              document.getElementById('cover-art').src = imageUrl;
          } else {
              document.getElementById('cover-art').src = ''; // Set a default image or leave blank
          }
      },
      onError: function (error) {
          console.log(error);
          // Handle errors or set default values
          document.getElementById('track-caption').textContent = 'Unknown Title - Unknown Artist';
          currentTrack.textContent = 'Unknown Title - Unknown Artist';
          document.getElementById('cover-art').src = ''; // Set a default image or leave blank
      }
  });

  // Update the tracklist highlighting
  document.querySelectorAll('#track-list li').forEach((li, index) => {
      if (index === songIndex) {
          li.classList.add('current-track');
      } else {
          li.classList.remove('current-track');
      }
  });
}

// Play and Pause functionality
playBtn.addEventListener('click', function() {
    player.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline';
});

pauseBtn.addEventListener('click', function() {
    player.pause();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline';
});

// Volume Control
volumeControl.addEventListener('input', function() {
    player.volume = this.value;
});



// Load the first song initially and update track info
loadSong(currentSongIndex);

player.addEventListener('ended', function() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  player.play();
});

const trackListToggle = document.getElementById('tracklist-toggle');
const trackList = document.getElementById('track-list');

trackListToggle.addEventListener('click', function() {
    trackList.style.display = trackList.style.display === 'none' ? 'block' : 'none';
});

songs.forEach((song, index) => {
  let li = document.createElement('li');
  li.textContent = (index === 0 ? "Now Playing: " : "Up Next: ") + song.split('/').pop();
  li.addEventListener('click', () => {
      loadSong(index);
      player.play();
  });
  trackList.appendChild(li);
});