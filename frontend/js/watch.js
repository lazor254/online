window.onload = function () {
    const currentPath = window.location.pathname;

    // Select all nav links
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
};

const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

hamburger.addEventListener('click', () => {
    navLinksMobile.classList.toggle('active');
});
        
// watch.js
async function fetchVideosForWatchSection() {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('User is not logged in.');
            return;
        }

        const response = await fetch('http://localhost:7000/api/videos/all', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const videos = await response.json();
        console.log('Fetched Videos:', videos);  // Log the response to see the fetched data
        
        if (response.ok) {
            populateWatchSection(videos);  // Call the correct function
        } else {
            console.error('Error fetching videos:', videos.message);
        }
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}
   

// function to create and display video cards
function populateWatchSection(videos) {
    const container = document.getElementById('videos-container');
    container.innerHTML = ''; // Clear any existing content

    videos.forEach((video) => {
        const amountPerPosition = (video.budget / video.positions).toFixed(2);
        const card = document.createElement('div');
        card.className = 'video-card';

        // Generate YouTube thumbnail
        const videoId = getYouTubeVideoId(video.url);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

        // Format the instructions as an ordered list
        const formattedInstructions = formatInstructions(video.instructions);

        // Create the card HTML with instructions toggle and cash amount
        card.innerHTML = `
            <img src="${thumbnailUrl}" alt="${video.title} Thumbnail" class="thumbnail">
            <h3>${video.title}</h3>
            <p>Positions: ${video.positions}/${video.positions}</p>
            <p><strong>Earnings: ksh.${amountPerPosition}</strong></p>

            <!-- Information Button (i icon) -->
            <button class="info-icon" onclick="toggleInstructions(${video.id})">i</button>
            
            <!-- Instructions hidden initially -->
            <div id="instructions-${video.id}" class="instructions" style="display: none;">
                <ol>
                    ${formattedInstructions}
                </ol>
            </div>
            
            <button onclick="watchVideo('${video.url}')">Watch</button>
            <button onclick="openVerifyModal(${video.id})">Verify</button>  <!-- Trigger modal here -->
        `;

        container.appendChild(card);
    });
}

function formatInstructions(instructions) {
    // Split and trim instructions
    const steps = instructions.split('\n').map(step => step.trim());
  
    // Create numbered instructions
    return steps.map((step, index) => `${index + 1}. ${step}\n`).join('');
  }
  

// Helper to get the video ID from the URL
function getYouTubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


// Watch in a new tab
function watchVideo(url) {
    window.open(url, '_blank');
}

// Toggle instructions visibility
function toggleInstructions(videoId) {
    const instructions = document.getElementById(`instructions-${videoId}`);
    instructions.style.display = instructions.style.display === 'none' ? 'block' : 'none';
}

// open verification modal

function openVerifyModal(videoId) {
    const modal = document.getElementById('verifyModal');
    modal.style.display = 'flex';

   const user = sessionStorage.getItem('user');
   const parsedUser = user ? JSON.parse(user) : null;
   const userId = parsedUser ? parsedUser.id : null; 

   if (!userId) {
       alert('User ID not found. Please log in again.');
       return;
   }

    // Store video ID, user ID for backend submission
    const proofForm = document.getElementById('proofForm');
    proofForm.dataset.videoId = videoId;
    proofForm.dataset.userId = userId; 
}

document.getElementById('proofForm').addEventListener('submit', submitVerification);

// Handle form submission
async function submitVerification(event) {
    event.preventDefault();

    const proofForm = document.getElementById('proofForm');
    const formData = new FormData(proofForm);
    const userId = proofForm.dataset.userId;  
    const videoId = proofForm.dataset.videoId;

    formData.append('userId', userId);  
    formData.append('videoId', videoId);

    
    const token = sessionStorage.getItem('token'); 

    if (!token) {
        alert('Authentication token missing. Please log in again.');
        return;
    }

 
    console.log('FormData contents:');
    formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
    });

    try {
        const response = await fetch('http://localhost:7000/api/proofs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,  
            },
            body: formData
        });

        if (response.ok) {
            alert('Verification submitted successfully!');
            closeVerifyModal();
        } else {
            alert('Error submitting verification.');
        }
    } catch (error) {
        console.error('Error submitting verification:', error);
        alert('An error occurred. Please try again later.');
    }
}

function closeVerifyModal() {
    const modal = document.getElementById('verifyModal');
    modal.style.display = 'none';
}

document.getElementById('close').addEventListener('click', closeVerifyModal);




window.onload = fetchVideosForWatchSection;

