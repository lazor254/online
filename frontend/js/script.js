// Function to mark the current page link as active
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
}

// Typewriter effect function
function typeWriter(element, text, speed, callback) {
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed); // Control speed by changing the timeout duration
        } else if (callback) {
            setTimeout(callback, 500); // Delay before starting next text (if any)
        }
    }
    typing();
}

// Initiate typewriter effect for both h1 and p
window.onload = function() {
    const titleElement = document.getElementById('typewriter-title');
    const textElement = document.getElementById('typewriter-text');

    // Clear the text initially to start the typewriter effect
    titleElement.innerHTML = '';
    textElement.innerHTML = '';

    // Type title first, then paragraph
    typeWriter(titleElement, 'Welcome to Net _ Work', 100, function() {
        typeWriter(textElement, 'Invest and Turn Watch time to Cash', 75);
    });
}

  // Get the hamburger button and mobile nav links
  const hamburger = document.getElementById('hamburger');
  const navLinksMobile = document.getElementById('nav-links-mobile');

  // Add a click event listener to the hamburger button
  hamburger.addEventListener('click', () => {
      // Toggle the 'active' class to show/hide the mobile nav links
      navLinksMobile.classList.toggle('active');
  });