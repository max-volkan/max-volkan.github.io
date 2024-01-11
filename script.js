document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch metadata from the server
    function fetchMetadata() {
        fetch('http://54.193.138.44:8000/status-json.xsl')
            .then(response => response.json())
            .then(data => {
                const title = data.icestats.source.title;
                // Assuming the format is "artist - songTitle"
                const [artist, songTitle] = title.split(' - ');
    
                document.getElementById('song-name').textContent = songTitle || "Unknown Title";
                document.getElementById('artist-name').textContent = artist || "Unknown Artist";
            })
            .catch(error => console.error('Error fetching metadata:', error));
    }
    
    // Fetch metadata initially and then every 10 seconds
    fetchMetadata();
    setInterval(fetchMetadata, 10000);
    

    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeControl = document.getElementById('volume-control');

    // Initialize the Icecast stream
    player.src = 'http://54.193.138.44:8000/stream';

    // Play/Pause functionality
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

    // Volume Control
    let lastVolume = 0.1;

    volumeControl.addEventListener('input', () => {
        player.volume = volumeControl.value;
        updateSliderFill();
        toggleVolumeIcon(player.volume === 0);
    });

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

    updateSliderFill();
});