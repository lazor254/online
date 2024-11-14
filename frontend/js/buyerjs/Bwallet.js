document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('depositButton').addEventListener('click', function() {
        const depositForm = document.getElementById('depositForm');
        depositForm.style.display = depositForm.style.display === 'none' ? 'block' : 'none';
    });

    const closeoverlay = document.getElementById('closebtn');
    const depositForm = document.getElementById('depositForm');
    
    closeoverlay.addEventListener("click", () => {
        depositForm.style.display = "none";
    });

    document.getElementById('depositSubmissionForm').addEventListener('submit', async function(event) {
        event.preventDefault(); 
    
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('You are not logged in');
            alert('Log in to make a deposit.');
            return;
        }

        const user = sessionStorage.getItem('user');
        const parsedUser = user ? JSON.parse(user) : null;
        const userId = parsedUser  ? parsedUser.id : null;
    
       
        if (!userId) {
          console.error('User ID is missing');
          alert('User ID is required for making a deposit.');
          return;
        }
    
    
        const amount = document.getElementById('amount').value;
        const code = document.getElementById('code').value;
    
   
        if (!amount || !code) {
            alert('Amount and code are required.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:7000/api/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, code, user_id: userId }) 
            });

            if (!response.ok) {
                                const errorText = await response.text();
                                console.error('Response error:', errorText);
                                throw new Error('Server responded with an error');
                                }
            
            const result = await response.json();
            alert(result.message);
    
            if (response.ok) {
                const depositForm = document.getElementById('depositSubmissionForm');
             
            } 
            depositForm.style.display = 'none';

        } catch (error) {
            console.error('Error submitting deposit:', error);
            alert('Failed to submit deposit. Please try again.');
        }
    });
});    