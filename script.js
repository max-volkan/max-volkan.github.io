
// Assuming the global `musicMetadata` variable is available after loading the library via a script tag.
document.addEventListener('DOMContentLoaded', function() {
    
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
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const currentTrack = document.getElementById('current-track');
    const volumeControl = document.getElementById('volume-control');
    const trackListToggle = document.getElementById('tracklist-toggle');
    const trackList = document.getElementById('track-list');
    const coverArt = document.getElementById('cover-art');

    async function loadSong(songIndex) {
        const songPath = songs[songIndex];
        player.src = songPath;

        try {
            const response = await fetch(songPath);
            const arrayBuffer = await response.arrayBuffer();
            const metadata = await musicMetadata.parseBlob(new Blob([arrayBuffer]));

            // Extract and use metadata here
            const title = metadata.common.title || "Unknown Title";
            const artist = metadata.common.artist || "Unknown Artist";
            currentTrack.textContent = `${title} - ${artist}`;

            // Update cover art
            if (metadata.common.picture && metadata.common.picture.length > 0) {
                const picture = metadata.common.picture[0];
                const imageUrl = URL.createObjectURL(new Blob([picture.data], { type: picture.format }));
                coverArt.src = imageUrl;
                coverArt.alt = `Cover Art for ${title}`;
            } else {
                coverArt.src = ''; // default image or leave blank
                coverArt.alt = 'No cover art available';
            }
        } catch (error) {
            console.error("Error reading metadata:", error);
            currentTrack.textContent = 'Unknown Title - Unknown Artist';
            coverArt.src = ''; // default image or leave blank
            coverArt.alt = 'No cover art available';
        }

        updateTrackListHighlighting(songIndex);
    }

    function updateTrackListHighlighting(activeIndex) {
        document.querySelectorAll('#track-list li').forEach((li, index) => {
            li.classList.toggle('current-track', index === activeIndex);
        });
    }

    // Toggle track list visibility
    trackListToggle.addEventListener('click', function() {
        trackList.style.display = trackList.style.display === 'block' ? 'none' : 'block';
    });

    // Populate the tracklist and add click event to each track
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.split('/').pop();
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex).then(() => player.play());
        });
        trackList.appendChild(li);
    });

    // Event listeners for player controls
    playBtn.addEventListener('click', () => {
        player.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline';
    });

    pauseBtn.addEventListener('click', () => {
        player.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline';
    });

    volumeControl.addEventListener('input', () => {
        player.volume = volumeControl.value;
    });

    player.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex).then(() => player.play());
    });

    // Load the first song
    loadSong(currentSongIndex);

    
});
