document.addEventListener('DOMContentLoaded', () => {
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
        window.location.replace('./home.html');
    } else {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            console.log('Welcome back, ' + user.username);
        }
    }

    const loginForm = document.getElementById('loginform');
    const loginMsg = document.getElementById('login-msg');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:7000/api/login', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });

                if (!response.ok) {
                    // Check for server-side errors
                    const errorData = await response.json();
                    loginMsg.textContent = errorData.message || 'Login failed, please try again';
                    return; // Exit early if there's an error
                }

                const {message, token, user} = await response.json();

                const usertype = user.usertype.toLowerCase();
                
                // Save token and user data in sessionStorage
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(user)); // Save full user data
                
                sessionStorage.setItem('user_type', usertype); // Save the user type separately
                
                console.log("User Type stored in sessionStorage: ", sessionStorage.getItem('user_type'));
                
                loginMsg.textContent = 'Login successful 😊';
                window.location.href =  usertype === 'buyer' ? './Bhome.html' : './home.html';

            } catch (err) {
                loginMsg.textContent = 'An error occurred: ' + err.message;
            }
        });
    }

    const showPasswordCheckbox = document.getElementById('show-password');
    const passwordInput = document.getElementById('password');

    showPasswordCheckbox.addEventListener('change', function() {
        if (showPasswordCheckbox.checked) {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });
});
