document.addEventListener('DOMContentLoaded', function() {
    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeControl = document.getElementById('volume-control');
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');
    const testAnimationBtn = document.getElementById('test-animation-btn');


    player.volume = 0.5; // Set a default volume level, e.g., 50%
    volumeControl.value = player.volume; // Update the slider to match
    updateSliderFill(); // Update the visual fill of the slider

    let currentSong = '';
    let currentArtist = '';

    document.addEventListener('DOMContentLoaded', function() {
        // Get all navigation links
        var navLinks = document.querySelectorAll('nav ul li a');
    
        // Get current URL
        var currentUrl = window.location.href;
    
        // Loop through links and highlight the current page
        navLinks.forEach(function(link) {
            if (link.href === currentUrl) {
                link.classList.add('current-page');
            }
        });
    });

    function fetchMetadata() {
        fetch('https://stream.maxp3.xyz/status-json.xsl')
            .then(response => response.json())
            .then(data => {
                //console.log('Icecast data:', data);  // Log raw Icecast data
                const metadata = data.icestats.source.title.split(' - ');
                //console.log('Parsed title and artist:', metadata);  // Log parsed title and artist
        

                const newSong = metadata[0] || 'Unknown Song';
                const newArtist = metadata[1] || 'Unknown Artist';

                // Check if the song or artist has changed
                if (newSong !== currentSong || newArtist !== currentArtist) {
                    // Update current song and artist
                    currentSong = newSong;
                    currentArtist = newArtist;

                    // Trigger the update with animation
                    animateTextChange(newSong, newArtist);
                }

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
                    // console.log('No matching metadata found for:', artistName, songTitle);
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

      
      function animateTextChange(newSongName, newArtistName) {
        const songInfoContainer = document.getElementById('song-info');
        const oldSongName = document.getElementById('song-name');
        const oldArtistName = document.getElementById('artist-name');
        const separator = document.getElementById('separator');
        
        // Fade out the current text
        songName.classList.add('fade-out');
        artistName.classList.add('fade-out');
        separator.classList.add('fade-out');

        // Create elements for new song name and artist name
        const newSongNameElem = document.createElement('span');
        newSongNameElem.textContent = newSongName;
        newSongNameElem.style.visibility = 'hidden'; // Hide for measurement
        newSongNameElem.style.position = 'absolute'; // Position out of flow for measurement
    
        const newArtistNameElem = document.createElement('span');
        newArtistNameElem.textContent = newArtistName;
        newArtistNameElem.style.visibility = 'hidden'; // Hide for measurement
        newArtistNameElem.style.position = 'absolute'; // Position out of flow for measurement
    
        // Append temporary elements to songInfoContainer for width calculation
        songInfoContainer.appendChild(newSongNameElem);
        songInfoContainer.appendChild(newArtistNameElem);
    
        // Calculate the new width
        let newWidth = newSongNameElem.offsetWidth + newArtistNameElem.offsetWidth + 60; // 20 is additional space for the separator and padding
        newWidth = Math.min(newWidth, songInfoContainer.parentElement.offsetWidth - 40); // Ensure it doesn't exceed parent width minus padding
    
        // Clean up temporary elements
        songInfoContainer.removeChild(newSongNameElem);
        songInfoContainer.removeChild(newArtistNameElem);
    
        // Animate the container width
        songInfoContainer.style.width = `${newWidth}px`;
    
    // Listen for animation end on one of the elements
        songName.addEventListener('animationend', function() {
        // Update the text after fade out completes
        songName.textContent = newSongName;
        artistName.textContent = newArtistName;

        // Adjust separator position based on new text
        // (Add your logic here if the separator needs repositioning)

        // Remove fade-out class and add fade-in class for new text
        songName.classList.remove('fade-out');
        artistName.classList.remove('fade-out');
        separator.classList.remove('fade-out');
        songName.classList.add('fade-in');
        artistName.classList.add('fade-in');
        separator.classList.add('fade-in');
    }, { once: true }); // Ensure the event listener is removed after it fires
    }

    function updateSliderFill() {
        const fillPercentage = player.volume * 100;
        volumeControl.style.setProperty('--fill-percentage', fillPercentage + '%');
    }

    // Initialize the slider fill on page load
    updateSliderFill();
});