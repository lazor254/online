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
                const response = await fetch('http://localhost:7000/api/login', {  // Fixed the port here
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password })
                });

                let data;
                try {
                    data = await response.json();
                } catch (err) {
                    data = {};
                }

                if (!response.ok) {
                    loginMsg.textContent = data.message || 'Login failed, please try again';
                } else {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('user', JSON.stringify(data.user)); // Save user data

                    loginMsg.textContent = 'Login successful 😊';
                    setTimeout(() => {
                        window.location.href = './home.html';
                    }, 1000);
                }
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
