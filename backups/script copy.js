

document.addEventListener('DOMContentLoaded', function() {
    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const volumeControl = document.getElementById('volume-control');
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');
    const testAnimationBtn = document.getElementById('test-animation-btn');
    // Variables for audio and visualizer elements
    const container = document.getElementById("container");
    const canvas = document.getElementById("audio-visualizer");
    const ctx = canvas.getContext("2d");
    
    let audioCtx;
    let analyser;
    
    player.crossOrigin = "anonymous"; // Set CORS to anonymous for the audio element

    // Set up canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;



    const waveformHeightFactor = 1; // Height factor for the waveforms
    const verticalOffset = 1000; // Vertical offset in pixels

function drawWaveform(analyser) {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteTimeDomainData(dataArray);
        
        // Calculate the middle position of the canvas
        const middle = canvas.height / 2;

        // Draw the first waveform at the middle position minus the offset
        drawSingleWaveform(dataArray, bufferLength, middle - verticalOffset);

        // Draw the second waveform at the middle position plus the offset
        drawSingleWaveform(dataArray, bufferLength, middle + verticalOffset);
    }

    animate();
}

function drawSingleWaveform(dataArray, bufferLength, verticalPosition) {
    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Value between 0 and 2
        const y = v * canvas.height / waveformHeightFactor + verticalPosition;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.lineTo(canvas.width, verticalPosition);
    ctx.strokeStyle = 'white'; // Set waveform color
    ctx.stroke();
}


    // Function to initialize audio context and analyser
    function initAudio() {
        
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.smoothingTimeConstant = 0.6;
        console.log('AudioContext state:', audioCtx.state);
        
        const audioSource = audioCtx.createMediaElementSource(player);
        audioSource.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        drawWaveform(analyser); // Call your drawVisualizer function here
    }

    player.volume = 0.5; // Set a default volume level, e.g., 50%
    volumeControl.value = player.volume; // Update the slider to match
    updateSliderFill(); // Update the visual fill of the slider

    let currentSong = '';
    let currentArtist = '';

    
    var navLinks = document.querySelectorAll('nav ul li a');
    
    // Get current URL
    var currentUrl = window.location.href;
    
    // Loop through links and highlight the current page
    navLinks.forEach(function(link) {
        if (link.href === currentUrl) {
            link.classList.add('current-page');
        }
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
                    typeWriterComment(songMetadata.comment); // Display comment with typewriter animation
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
        console.log('Play button clicked');
        if (!audioCtx) {
            initAudio();
        }else {
            console.log('AudioContext state:', audioCtx.state);
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        // Set the src to the live stream URL to catch up to the live point
        player.src = "https://stream.maxp3.xyz/stream";
        player.load(); // Load the new source
        player.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline';

        if (!analyser) {
            console.error("Analyser is not initialized.");
            return;
        }

    });

    pauseBtn.addEventListener('click', () => {
        player.pause();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline';
    });


    function typeWriterComment(comment) {
        const container = document.getElementById('ai-comments');
        container.textContent = ''; // Clear previous comment
        let i = 0;
        function typing() {
          if (i < comment.length) {
            container.textContent += comment.charAt(i);
            i++;
            setTimeout(typing, 50); // Adjust speed as needed
          }
        }
        typing();
    }

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