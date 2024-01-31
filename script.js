

document.addEventListener('DOMContentLoaded', function() {
    const player = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    //const volumeControl = document.getElementById('volume-control');
    const songName = document.getElementById('song-name');
    const artistName = document.getElementById('artist-name');
    const testAnimationBtn = document.getElementById('test-animation-btn');
    // Variables for audio and visualizer elements
    const container = document.getElementById("container");
    const canvas = document.getElementById("audio-visualizer");
    const ctx = canvas.getContext("2d");
    
    const noStreamMessage = document.getElementById('no-stream-message');
    const coverArtContainer = document.getElementById('cover-art'); // Adjust if necessary
    const aiCommentsContainer = document.getElementById('ai-comments'); // Adjust if necessary
    const songInfoContainer = document.getElementById('song-info'); // Adjust if necessary
    const bunnyMouthClosed = document.getElementById('bunnyMouthClosed');
    const bunnyMouthOpen = document.getElementById('bunnyMouthOpen');

    let audioCtx;
    let analyser;
    
    player.crossOrigin = "anonymous"; // Set CORS to anonymous for the audio element

    // Set up canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    

    const waveformHeightFactor = 1; // Height factor for the waveforms
    const verticalOffset = 1000; // Vertical offset in pixels

    let isPlaying = false; // Flag to indicate if the player is playing

    function drawWaveform(analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            if (!isPlaying) return; // Do not draw the waveform if not playing
    
            analyser.getByteTimeDomainData(dataArray);
    
            const middle = canvas.height / 2;
            drawSingleWaveform(dataArray, bufferLength, middle - verticalOffset + 100);
            drawSingleWaveform(dataArray, bufferLength, middle - verticalOffset - 150);
            drawSingleWaveform(dataArray, bufferLength, middle - verticalOffset + 350);
        }
    
        animate();
    }

    function drawSingleWaveform(dataArray, bufferLength, verticalPosition) {
        ctx.beginPath();
        const sliceWidth = canvas.width * 1.0 / bufferLength;
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
            if (x >= canvas.width) break; // Prevent drawing beyond the canvas width
        }
    
        ctx.strokeStyle = 'white'; // Set waveform color
        ctx.stroke();
    }


    // Function to update the UI based on stream status
    function updateUIBasedOnStream(isPlaying) {
        if (isPlaying) {
            noStreamMessage.style.display = 'none';
            coverArtContainer.style.display = 'block';
            aiCommentsContainer.style.display = 'block';
            songInfoContainer.style.display = 'block';
            bunnyMouthClosed.style.display = 'block';

        } else {
            noStreamMessage.style.display = 'block';
            coverArtContainer.style.display = 'none';
            aiCommentsContainer.style.display = 'none';
            songInfoContainer.style.display = 'none';
            bunnyMouthClosed.style.display = 'none';
        }
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

    //player.volume = 0.5; // Set a default volume level, e.g., 50%
    //volumeControl.value = player.volume; // Update the slider to match
    //updateSliderFill(); // Update the visual fill of the slider

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
                updateUIBasedOnStream(true); // Assume stream is playing if metadata is fetched

            })
            .catch(error => {
                console.error('Error fetching Icecast metadata:', error);
                updateUIBasedOnStream(false); 

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
        isPlaying = true;
        ctx.globalAlpha = 0; // Start with full transparency
        let alpha = 0;
        const fadeIn = setInterval(() => {
        alpha += 0.05; // Increment alpha value
        if (alpha >= 1) clearInterval(fadeIn);
        ctx.globalAlpha = alpha; // Apply the alpha value to the context
    }, 100); // Adjust the interval to control fade-in speed
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
        isPlaying = false;
    });

    


const volumeDial = document.getElementById('volume-dial');
    let isDragging = false;
    let dialCenter;
    let startAngle;

    function getAngle(event) {
        const dx = event.clientX - dialCenter.x;
        const dy = event.clientY - dialCenter.y;
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    volumeDial.addEventListener('pointerdown', function(event) {
        const rect = volumeDial.getBoundingClientRect();
        dialCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        startAngle = getAngle(event);
        isDragging = true;
    });

    document.addEventListener('pointermove', function(event) {
        if (isDragging) {
            const currentAngle = getAngle(event);
            const angleDifference = currentAngle - startAngle;
            const rotation = 'rotate(' + angleDifference + 'deg)';
            volumeDial.style.transform = rotation;
            // Update volume based on rotation
            // You need to map the angleDifference to volume range here
        }
    });

    document.addEventListener('pointerup', function(event) {
        if (isDragging) {
            isDragging = false;
            // Finalize the volume change
        }
    });

    

    function typeWriterComment(comment) {
        const container = document.getElementById('ai-comments');
        const bunnyMouthOpen = document.getElementById('bunnyMouthOpen');
        const bunnyMouthClosed = document.getElementById('bunnyMouthClosed');
        container.textContent = ''; // Clear previous comment
        let i = 0;
        let typingInterval;
        let mouthInterval;
        let isMouthOpen = false; // Track the state of the rabbit's mouth
    
        // Function to toggle rabbit's mouth
        function toggleMouth() {
            isMouthOpen = !isMouthOpen;
            bunnyMouthOpen.style.display = isMouthOpen ? 'block' : 'none';
            bunnyMouthClosed.style.display = isMouthOpen ? 'none' : 'block';
        }
    
        // Function to handle typing effect
        function typing() {
            if (i < comment.length) {
                container.textContent += comment.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                clearInterval(mouthInterval);
                bunnyMouthOpen.style.display = 'none';
                bunnyMouthClosed.style.display = 'block';
            }
        }
    
        // Start the typing effect and mouth animation
        typingInterval = setInterval(typing, 50); // Adjust typing speed as needed
        mouthInterval = setInterval(toggleMouth, 200); // Adjust mouth speed as needed
    
        // Handle visibility change
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                // Clear intervals to stop typing and mouth animation
                clearInterval(typingInterval);
                clearInterval(mouthInterval);
            } else if (document.visibilityState === 'visible') {
                // Resume typing and mouth animation
                if (i < comment.length) {
                    typingInterval = setInterval(typing, 50); // Adjust typing speed as needed
                    mouthInterval = setInterval(toggleMouth, 200); // Adjust mouth speed as needed
                }
            }
        });
    }

    document.querySelector('.hamburger-menu').addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('header nav ul').classList.toggle('active');
    });

    /*let lastVolume = 0.1; // Default volume when unmuting from 0

    document.getElementById('volume-btn').addEventListener('click', function() {
        const volumeIconPath = "M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z";// Path for volume icon
        const muteIconPath = "M10.0012 8.99984H9.1C8.53995 8.99984 8.25992 8.99984 8.04601 9.10883C7.85785 9.20471 7.70487 9.35769 7.60899 9.54585C7.5 9.75976 7.5 10.0398 7.5 10.5998V13.3998C7.5 13.9599 7.5 14.2399 7.60899 14.4538C7.70487 14.642 7.85785 14.795 8.04601 14.8908C8.25992 14.9998 8.53995 14.9998 9.1 14.9998H10.0012C10.5521 14.9998 10.8276 14.9998 11.0829 15.0685C11.309 15.1294 11.5228 15.2295 11.7143 15.3643C11.9305 15.5164 12.1068 15.728 12.4595 16.1512L15.0854 19.3023C15.5211 19.8252 15.739 20.0866 15.9292 20.1138C16.094 20.1373 16.2597 20.0774 16.3712 19.9538C16.5 19.811 16.5 19.4708 16.5 18.7902V5.20948C16.5 4.52892 16.5 4.18864 16.3712 4.04592C16.2597 3.92233 16.094 3.86234 15.9292 3.8859C15.7389 3.9131 15.5211 4.17451 15.0854 4.69733L12.4595 7.84843C12.1068 8.27166 11.9305 8.48328 11.7143 8.63542C11.5228 8.77021 11.309 8.87032 11.0829 8.93116C10.8276 8.99984 10.5521 8.99984 10.0012 8.99984Z"; // Path for mute icon
        const svgElement = document.querySelector('#volume-btn svg');
        const pathElement = svgElement.querySelector('path');
        
        if (player.volume > 0) {
            lastVolume = player.volume;
            player.volume = 0;
            volumeControl.value = 0;
            pathElement.setAttribute('d', muteIconPath); // Change to mute icon path
        } else {
            player.volume = lastVolume;
            volumeControl.value = lastVolume;
            pathElement.setAttribute('d', volumeIconPath); // Change to volume icon path
        }
        updateSliderFill();
    });

    volumeControl.addEventListener('input', () => {
        player.volume = volumeControl.value;
        updateSliderFill();
    
        // Get the SVG path element
        const pathElement = document.querySelector('#volume-btn svg path');
        
        // Define the SVG paths for both icons
        const volumeIconPath = "M16.0004 9.00009C16.6281 9.83575 17 10.8745 17 12.0001C17 13.1257 16.6281 14.1644 16.0004 15.0001M18 5.29177C19.8412 6.93973 21 9.33459 21 12.0001C21 14.6656 19.8412 17.0604 18 18.7084M4.6 9.00009H5.5012C6.05213 9.00009 6.32759 9.00009 6.58285 8.93141C6.80903 8.87056 7.02275 8.77046 7.21429 8.63566C7.43047 8.48353 7.60681 8.27191 7.95951 7.84868L10.5854 4.69758C11.0211 4.17476 11.2389 3.91335 11.4292 3.88614C11.594 3.86258 11.7597 3.92258 11.8712 4.04617C12 4.18889 12 4.52917 12 5.20973V18.7904C12 19.471 12 19.8113 11.8712 19.954C11.7597 20.0776 11.594 20.1376 11.4292 20.114C11.239 20.0868 11.0211 19.8254 10.5854 19.3026L7.95951 16.1515C7.60681 15.7283 7.43047 15.5166 7.21429 15.3645C7.02275 15.2297 6.80903 15.1296 6.58285 15.0688C6.32759 15.0001 6.05213 15.0001 5.5012 15.0001H4.6C4.03995 15.0001 3.75992 15.0001 3.54601 14.8911C3.35785 14.7952 3.20487 14.6422 3.10899 14.4541C3 14.2402 3 13.9601 3 13.4001V10.6001C3 10.04 3 9.76001 3.10899 9.54609C3.20487 9.35793 3.35785 9.20495 3.54601 9.10908C3.75992 9.00009 4.03995 9.00009 4.6 9.00009Z";// Path for volume icon
        const muteIconPath = "M10.0012 8.99984H9.1C8.53995 8.99984 8.25992 8.99984 8.04601 9.10883C7.85785 9.20471 7.70487 9.35769 7.60899 9.54585C7.5 9.75976 7.5 10.0398 7.5 10.5998V13.3998C7.5 13.9599 7.5 14.2399 7.60899 14.4538C7.70487 14.642 7.85785 14.795 8.04601 14.8908C8.25992 14.9998 8.53995 14.9998 9.1 14.9998H10.0012C10.5521 14.9998 10.8276 14.9998 11.0829 15.0685C11.309 15.1294 11.5228 15.2295 11.7143 15.3643C11.9305 15.5164 12.1068 15.728 12.4595 16.1512L15.0854 19.3023C15.5211 19.8252 15.739 20.0866 15.9292 20.1138C16.094 20.1373 16.2597 20.0774 16.3712 19.9538C16.5 19.811 16.5 19.4708 16.5 18.7902V5.20948C16.5 4.52892 16.5 4.18864 16.3712 4.04592C16.2597 3.92233 16.094 3.86234 15.9292 3.8859C15.7389 3.9131 15.5211 4.17451 15.0854 4.69733L12.4595 7.84843C12.1068 8.27166 11.9305 8.48328 11.7143 8.63542C11.5228 8.77021 11.309 8.87032 11.0829 8.93116C10.8276 8.99984 10.5521 8.99984 10.0012 8.99984Z"; // Path for mute icon
        
        // Check if the volume is 0 to decide which icon to display
        if (player.volume === 0) {
            pathElement.setAttribute('d', muteIconPath); // Change to mute icon path
        } else {
            pathElement.setAttribute('d', volumeIconPath); // Change to volume icon path
        }
    });*/
      
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

    /*function updateSliderFill() {
        const fillPercentage = player.volume * 100;
        volumeControl.style.setProperty('--fill-percentage', fillPercentage + '%');
    }

    // Initialize the slider fill on page load
    updateSliderFill();*/
});