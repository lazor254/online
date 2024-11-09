document.getElementById('videoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const instructions = document.getElementById('instructions').value;
    const positions = parseInt(document.getElementById('positions').value);
    const budget = document.getElementById('budget').value;

    try {
        const token = sessionStorage.getItem('token');
        console.log('Token:', token); 

        const response = await fetch('http://localhost:7000/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Attach the token in Bearer format
            },
            body: JSON.stringify({ title, url, instructions, positions, budget })
        });

        if (response.ok) {
            alert('Video posted successfully!');
            document.getElementById('videoForm').reset();
        } else {
            const errorData = await response.json();
            console.log('Error response:', errorData); // Debugging: log error response from server
            alert('Failed to post video');
        }
    } catch (error) {
        console.log('Error:', error);
    }
});

window.onload = function() {
    const currentPath = window.location.pathname;

    // Select all nav links
    const navLinks = document.querySelectorAll('.nav-link');

    // Loop through links and add 'active' class to the one that matches the current URL
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
};

const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});
