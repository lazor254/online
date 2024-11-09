// Get the hamburger button and mobile nav links
const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

// Add a click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});

// Function to fetch and display videos
async function fetchVideos() {
    try {
        const token = sessionStorage.getItem('token'); // Ensure this matches your storage key exactly
        if (!token) {
            console.error('Token not found');
            alert('Authentication token not found. Please log in again.');
            return;
        }

        const response = await fetch('http://localhost:7000/api/videos/view', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching videos:', errorData.message);
            alert(errorData.message || 'Failed to load videos');
            return;
        }

        const videos = await response.json();
        populateTable(videos); 
    } catch (error) {
        console.error('Error fetching videos:', error);
        alert('An error occurred while fetching videos.');
    }
}


function populateTable(videos) {
    const tableBody = document.getElementById('tasks-body');
    tableBody.innerHTML = ''; // Clear any existing rows

    videos.forEach((video) => {
        const remaining_positions = video.positions - video.positions_filled;

        const row = document.createElement('tr');
        row.setAttribute('data-video-id', video.id); // Add data attribute for easy row identification
        row.innerHTML = `
            <td>${video.title}</td>
            <td>${video.positions}</td>
            <td id="positionsFilled-${video.id}">${video.position_filled}</td> <!-- Make sure to add an ID for dynamic update -->
            <td id="remainingPositions-${video.id}">${video.remaining_positions}</td> <!-- Add ID for dynamic update -->
            <td>
                 <button class="btn-delete" onclick="deleteTask(${video.id})">Delete Task</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}


// Function to delete a video
async function deleteTask(videoId) {
    const token = sessionStorage.getItem('token'); 

    try {
        const response = await fetch(`http://localhost:7000/api/videos/${videoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Video deleted successfully');
            // Optionally, refresh the video list or remove the video from the table
            fetchVideos();
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            alert('Failed to delete video');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call fetchVideos to populate the table when the page loads
window.onload = fetchVideos;
