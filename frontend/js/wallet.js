window.onload = function() {
    const currentPath = window.location.pathname;

   const navLinks = document.querySelectorAll('.nav-link');

   navLinks.forEach(link => {
       if (link.getAttribute('href') === currentPath) {
           link.classList.add('active');
       }
   });
}

document.addEventListener('DOMContentLoaded', async () => {
    const userData = sessionStorage.getItem('user');
    

    if (!userData) {
        console.error('User data not found in sessionStorage. Please log in.');
        return;
    }

    const userId = JSON.parse(userData).id; 
    console.log('Extracted userId:', userId); 

    try { 
        
        const token = sessionStorage.getItem('token');
        

        if (!token) {
            console.error('You are not logged in');
            return;
        }

       
        const response = await fetch('http://localhost:7000/api/wallet', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // console.log('Response status:', response.status); // Log response status for debugging

        if (!response.ok) {
            throw new Error('Failed to fetch wallet data');
        }

        const { earnings = 0, pending = 0 } = await response.json();
        // console.log('Fetched earnings and pending:', { earnings, Pending }); 


        document.getElementById('earnings').textContent = `Ksh.${Number(earnings).toFixed(2)}`;
        document.getElementById('pending').textContent = `Ksh.${Number(pending).toFixed(2)}`;

    } catch (error) {
        console.error('Error fetching wallet data: ', error);
    }
});



const hamburger = document.getElementById('hamburger');
const navLinksMobile = document.getElementById('nav-links-mobile');


hamburger.addEventListener('click', () => {
    navLinksMobile.classList.toggle('active');
});
