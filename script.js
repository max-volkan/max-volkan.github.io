document.addEventListener('DOMContentLoaded', function() {
    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeControl = document.getElementById('volume-control');
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');

    player.volume = 0.5; // Set a default volume level, e.g., 50%
    volumeControl.value = player.volume; // Update the slider to match
    updateSliderFill(); // Update the visual fill of the slider

    function fetchMetadata() {
        fetch('https://stream.maxp3.xyz/status-json.xsl')
            .then(response => response.json())
            .then(data => {
                console.log('Icecast data:', data);  // Log raw Icecast data
                const metadata = data.icestats.source.title.split(' - ');
                console.log('Parsed title and artist:', metadata);  // Log parsed title and artist
                songName.textContent = metadata[0] || 'Unknown Song';
                artistName.textContent = metadata[1] || 'Unknown Artist';

                updateCoverArt(metadata[0], metadata[1]);
            })
            .catch(error => {
                console.error('Error fetching Icecast metadata:', error);
            });
    }
   
    function updateCoverArt(artistName, songTitle) {
        fetch('./metadata.json')
            .then(response => response.json())
            .then(allMetadata => {
                // Ensure the artist and title match the format in metadata.json
                const songMetadata = allMetadata.find(meta => meta.artist === artistName && meta.title.includes(songTitle));
                if (songMetadata && songMetadata.cover_art) {
                    document.getElementById('cover-art').src = `./radio-song-crate-1/cover_arts/${songMetadata.cover_art}`;
                } else {
                    console.log('No matching metadata found for:', artistName, songTitle);
                }
            })
            .catch(error => console.error('Error fetching cover art metadata:', error));
    }

    // Fetch metadata initially and then every 10 seconds
    fetchMetadata();
    setInterval(fetchMetadata, 10000);

    const loadingIndicator = document.getElementById('loading-indicator');

    player.onplay = function() {
        loadingIndicator.style.display = 'block';
    };

    player.onplaying = function() {
        loadingIndicator.style.display = 'none';
    };

    playBtn.addEventListener('click', () => {
        // Set the src to the live stream URL to catch up to the live point
        player.src = "https://stream.maxp3.xyz/stream";
        player.load(); // Load the new source
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
        updateSliderFill();
        toggleVolumeIcon(player.volume === 0);
    });

    player.addEventListener('volumechange', () => {
        if (player.volume === 0) {
          document.getElementById('volume-icon').style.display = 'none';
          document.getElementById('mute-icon').style.display = 'block';
        } else {
          document.getElementById('volume-icon').style.display = 'block';
          document.getElementById('mute-icon').style.display = 'none';
        }
      });

    function updateSliderFill() {
        const fillPercentage = player.volume * 100;
        volumeControl.style.setProperty('--fill-percentage', fillPercentage + '%');
    }

    // Initialize the slider fill on page load
    updateSliderFill();
});