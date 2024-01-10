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
        
        // Fetch the song as a Blob from the server
        fetch(songPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            // Now we have the Blob, set it as the source for the audio player
            player.src = URL.createObjectURL(blob);
    
            // Use jsmediatags to read the metadata from the Blob
            jsmediatags.read(blob, {
                onSuccess: function(tag) {
                    const title = tag.tags.title || "Unknown Title";
                    const artist = tag.tags.artist || "Unknown Artist";
                    currentTrack.textContent = `${title} - ${artist}`;
    
                    if (tag.tags.picture) {
                        let base64String = "";
                        for (let i = 0; i < tag.tags.picture.data.length; i++) {
                            base64String += String.fromCharCode(tag.tags.picture.data[i]);
                        }
                        const imageUrl = "data:" + tag.tags.picture.format + ";base64," + window.btoa(base64String);
                        coverArt.src = imageUrl;
                        coverArt.alt = `Cover Art for ${title}`;
                    } else {
                        coverArt.src = ''; // default image or leave blank
                        coverArt.alt = 'No cover art available';
                    }
                },
                onError: function(error) {
                    console.error("Error reading metadata:", error);
                    currentTrack.textContent = 'Unknown Title - Unknown Artist';
                    coverArt.src = ''; // default image or leave blank
                    coverArt.alt = 'No cover art available';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the song:', error);
            currentTrack.textContent = 'Error loading song';
        });
    
        updateTrackListHighlighting(songIndex);
    }

    function updateTrackListHighlighting(activeIndex) {
        document.querySelectorAll('#track-list li').forEach((li, index) => {
            li.classList.toggle('current-track', index === activeIndex);
        });
    }

    trackListToggle.addEventListener('click', function() {
        trackList.style.display = trackList.style.display === 'block' ? 'none' : 'block';
    });

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.split('/').pop();
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex).then(() => player.play());
        });
        trackList.appendChild(li);
    });

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

    loadSong(currentSongIndex);
});
