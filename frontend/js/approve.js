const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');

hamburger.addEventListener('click', () => {
    navLinksMobile.classList.toggle('active');
});
