document.getElementById('emailForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const server = document.getElementById('server').value;
    const port = document.getElementById('port').value;
    const ssl = document.getElementById('ssl').checked;

    // Display loading message
    const loadingMessage = document.getElementById('loading');
    loadingMessage.style.display = 'block';
    loadingMessage.textContent = 'Loading...';

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, server, port, ssl })
        });

        const result = await response.json();

        if (response.ok) {
            window.location.href = 'breadboard.html';
        } else {
            throw new Error(result.message || 'Invalid credentials or server error.');
        }
    } catch (error) {
        document.getElementById('status').textContent = `Login failed: ${error.message}`;
        console.error('Login error:', error);
    } finally {
        loadingMessage.style.display = 'none';
    }
});

// Password visibility toggle
document.getElementById('showPassword').addEventListener('change', function () {
    const passwordField = document.getElementById('password');
    passwordField.type = this.checked ? 'text' : 'password';
});
