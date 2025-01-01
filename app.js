document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const imapServer = document.getElementById('imap-server').value;
    const port = document.getElementById('port').value;
    const ssl = document.getElementById('ssl').checked;

    // Simulating login success
    if (email && password && imapServer && port) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('breadboard').classList.remove('hidden');
    } else {
        document.getElementById('status').textContent = 'Login failed: Please check inputs.';
    }
});

document.getElementById('logout').addEventListener('click', () => {
    document.getElementById('breadboard').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
});

document.querySelectorAll('.folder-btn').forEach(button => {
    button.addEventListener('click', () => {
        const folder = button.dataset.folder;
        document.getElementById('folder-name').textContent = folder.charAt(0).toUpperCase() + folder.slice(1);
        document.getElementById('email-list').innerHTML = `<li>Loading ${folder}...</li>`;
    });
});

document.getElementById('refresh').addEventListener('click', () => {
    document.getElementById('email-list').innerHTML = '<li>Refreshing...</li>';
});

