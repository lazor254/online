document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();   // Authentication check before anything else
    markActiveLink();        // Initialize active link highlighting
    initTypewriter();        // Initialize typewriter effect
    initHamburgerMenu();     // Initialize hamburger menu functionality


function markActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function typeWriter(element, text, speed, callback) {
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed); 
        } else if (callback) {
            setTimeout(callback, 500); // Delay before starting next text (if any)
        }
    }
    typing();
}

function initTypewriter() {
    const titleElement = document.getElementById('typewriter-title');
    const textElement = document.getElementById('typewriter-text');

    if (titleElement && textElement) {  // Check if elements exist
        titleElement.innerHTML = '';
        textElement.innerHTML = '';

        // Type title first, then paragraph
        typeWriter(titleElement, 'Welcome to Net _ Work', 100, function() {
            typeWriter(textElement, 'Invest in Wit and Turn Watch time to Cash', 75);
        });
    } else {
        console.error('Typewriter elements not found!');
    }
}

// Function to handle the hamburger menu toggle
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinksMobile = document.getElementById('nav-links-mobile');

    if (hamburger && navLinksMobile) {  // Check if elements exist
        hamburger.addEventListener('click', () => {
            // Toggle the 'active' class to show/hide the mobile nav links
            navLinksMobile.classList.toggle('active');
        });
    } else {
        console.error('Hamburger or mobile nav elements not found!');
    }
}

// Authentication and redirection based on user type
function checkAuthentication() {
    const sessionToken = sessionStorage.getItem('token');
    const userType = sessionStorage.getItem('user_type');
    
    // If no token is found, redirect to the login page
    if (!sessionToken) {
        window.location.replace('./login.html');
        return; // Stop further execution
    }

    // // Redirect based on user type
    // if (userType) {
    //     if (userType === 'tasker') {
    //         window.location.replace('./home.html');  // Redirect tasker to home.html
    //     } else if (userType === 'buyer') {
    //         window.location.replace('./Bhome.html'); // Redirect buyer to bhome.html (fix filename)
    //     }
    // }
}

});