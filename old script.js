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

    function fetchMetadata() {
        fetch('/path/to/metadata/api')
            .then(response => response.json())
            .then(data => {
                document.getElementById('song-name').textContent = data.title;
                document.getElementById('artist-name').textContent = data.artist;
            })
            .catch(error => console.error('Error fetching metadata:', error));
    }
    
    // Fetch metadata initially and then every 10 seconds
    fetchMetadata();
    setInterval(fetchMetadata, 10000);

    let currentSongIndex = 0;
    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const currentTrack = document.getElementById('current-track');
    const volumeControl = document.getElementById('volume-control');
    const trackListToggle = document.getElementById('tracklist-toggle');
    const trackList = document.getElementById('track-list');
    const coverArt = document.getElementById('cover-art');

    function loadSong(songIndex) {
    return new Promise((resolve, reject) => {
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

                    document.getElementById('song-name').textContent = title;
                    document.getElementById('artist-name').textContent = artist;
                    document.getElementById('song-info').style.display = 'block';

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
                    const nextIndex = (songIndex + 1) % songs.length;
                    updateNextTrackInfo(nextIndex); // Update next track info here
                    resolve();
                },
                onError: function(error) {
                    console.error("Error reading metadata:", error);
                    currentTrack.textContent = 'Unknown Title - Unknown Artist';
                    coverArt.src = ''; // default image or leave blank
                    coverArt.alt = 'No cover art available';
                    document.getElementById('song-info').style.display = 'none';
                    reject(error); // Reject the promise on error
                }
            });
        })
            .catch(error => {
                console.error('Error fetching the song:', error);
                currentTrack.textContent = 'Error loading song';
                reject(error); // Reject the promise on error
            });
        });
    }

    function updateTrackListHighlighting(activeIndex) {
        document.querySelectorAll('#track-list li').forEach((li, index) => {
            li.classList.toggle('current-track', index === activeIndex);
        });
    }

    function updateNextTrackInfo(nextIndex) {
        // Assuming the song title and artist can be derived from the song file name
        // Modify this logic based on how your song titles and artist names are formatted
        const nextSong = songs[nextIndex];
        const songDetails = nextSong.split('/').pop().split('.')[0]; // Example: 'songTitle - artistName'
        document.getElementById('next-track').textContent = songDetails;
    }

    trackListToggle.addEventListener('click', function() {
        trackList.style.display = trackList.style.display === 'block' ? 'none' : 'block';
    });

    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.split('/').pop(); // Extract the song name from the path
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex).then(() => {
                player.play(); // Start playing after loading the song
            });
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

    let lastVolume = 0.1; // Default volume when unmuting from 0

    document.getElementById('volume-btn').addEventListener('click', function() {
        if (player.volume > 0) {
            lastVolume = player.volume;
            player.volume = 0;
            volumeControl.value = 0;
            updateSliderFill();
            toggleVolumeIcon(true);
        } else {
            player.volume = lastVolume;
            volumeControl.value = lastVolume;
            updateSliderFill();
            toggleVolumeIcon(false);
        }
    });

    volumeControl.addEventListener('input', () => {
        player.volume = volumeControl.value;
        updateSliderFill();
        toggleVolumeIcon(player.volume === 0);
    });

    function toggleVolumeIcon(isMuted) {
        const volumeIcon = document.getElementById('volume-icon');
        const muteIcon = document.getElementById('mute-icon');
    
        if (isMuted) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
            muteIcon.setAttribute("width", "50px");
            muteIcon.setAttribute("height", "50px");
        } else {
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
            volumeIcon.setAttribute("width", "50px");
            volumeIcon.setAttribute("height", "50px");
        }
    }

    function updateSliderFill() {
        const fillPercentage = player.volume * 100;
        volumeControl.style.setProperty('--fill-percentage', fillPercentage + '%');
    }

    // Initialize the slider fill on page load
    updateSliderFill();
   
    loadSong(currentSongIndex);
    volumeControl.style.backgroundSize = (volumeControl.value * 100) + '% 100%';
});
