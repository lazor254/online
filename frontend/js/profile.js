document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Get the hamburger button and mobile nav links
    const hamburger = document.getElementById('hamburger');
    const navLinksMobile = document.getElementById('nav-links-mobile');

    if (hamburger) {
        // Add a click event listener to the hamburger button
        hamburger.addEventListener('click', () => {
            // Toggle the 'active' class to show/hide the mobile nav links
            navLinksMobile.classList.toggle('active');
        });
    }

    // Logout button functionality
    const logoutBtn = document.getElementById('logout-btn'); // Remove the dot

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Clear all session storage items
            sessionStorage.clear();
            
            // Optionally, if you have a backend API to invalidate the session, call it here
            fetch('http://localhost:7000/api/logout', { method: 'POST' });

            // Redirect to the login page
            window.location.href = './login.html';
        });
    }
});

// Photo upload preview
document.getElementById('upload-photo').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        document.getElementById('photo-preview').src = reader.result;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
});
