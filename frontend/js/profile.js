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


// Get the hamburger button and mobile nav links
const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

// Add a click event listener to the hamburger button
hamburger.addEventListener('click', () => {
    // Toggle the 'active' class to show/hide the mobile nav links
    navLinksMobile.classList.toggle('active');
});

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
