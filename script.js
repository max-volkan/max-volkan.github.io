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
                // Process your data here
                const metadata = data.icestats.source.title.split(' - ');
                songName.textContent = metadata[0] || 'Unknown Song';
                artistName.textContent = metadata[1] || 'Unknown Artist';
            })
            .catch(error => console.error('Error fetching metadata:', error));
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

    function toggleVolumeIcon(isMuted) {
        const volumeIcon = document.getElementById('volume-icon');
        const muteIcon = document.getElementById('mute-icon');
    
        if (isMuted) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'block';
        } else {
            volumeIcon.style.display = 'block';
            muteIcon.style.display = 'none';
        }
    }

    function updateSliderFill() {
        const fillPercentage = player.volume * 100;
        volumeControl.style.setProperty('--fill-percentage', fillPercentage + '%');
    }

    // Initialize the slider fill on page load
    updateSliderFill();
});