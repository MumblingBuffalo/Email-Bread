const { ipcRenderer } = require('electron');

// Elements
const refreshButton = document.getElementById('refreshButton');
const logoutButton = document.getElementById('logoutButton');
const folderButtons = document.querySelectorAll('.folder-button');
const emailList = document.querySelector('.email-list');
const searchInput = document.querySelector('.search-bar');
const emailContent = document.querySelector('.email-content');
const loggedInUserElement = document.getElementById('loggedInUser');

// State
let currentFolder = 'inbox'; // Default folder

// Utility to display loading
const setLoadingState = (loading) => {
    refreshButton.textContent = loading ? 'Refreshing...' : 'Refresh';
    refreshButton.disabled = loading;
};

// Utility to update folder active state
const updateActiveFolder = () => {
    folderButtons.forEach((button) => {
        if (button.dataset.folder === currentFolder) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
};

// Fetch emails for the current folder
const fetchEmails = async () => {
    setLoadingState(true);

    try {
        const emails = await ipcRenderer.invoke('fetch-emails', currentFolder);
        renderEmails(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        alert('Failed to fetch emails. Please try again.');
    } finally {
        setLoadingState(false);
    }
};

// Render emails
const renderEmails = (emails) => {
    emailList.innerHTML = '';

    if (emails.length === 0) {
        const noToastMessage = document.createElement('div');
        noToastMessage.className = 'no-toast';
        noToastMessage.textContent = 'You Currently Have No Toast';
        emailList.appendChild(noToastMessage);
        return;
    }

    emails.forEach((email) => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-list-item';
        emailItem.innerHTML = `
            <div class="email-title">${email.subject}</div>
            <div class="email-meta">From: ${email.from}</div>
        `;
        emailItem.addEventListener('click', () => displayEmailContent(email));
        emailList.appendChild(emailItem);
    });
};

// Display email content
const displayEmailContent = (email) => {
    emailContent.innerHTML = `
        <h2>${email.subject}</h2>
        <p><strong>From:</strong> ${email.from}</p>
        <p>${email.body}</p>
    `;
};

// Event: Refresh button
refreshButton.addEventListener('click', () => {
    fetchEmails();
});

// Event: Logout button
logoutButton.addEventListener('click', () => {
    ipcRenderer.send('logout');
});

// Event: Folder buttons
folderButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const folder = button.dataset.folder;
        if (folder !== currentFolder) {
            currentFolder = folder;
            updateActiveFolder();
            fetchEmails();
        }
    });
});

// Event: Search bar
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const emailItems = document.querySelectorAll('.email-list-item');

    emailItems.forEach((item) => {
        const title = item.querySelector('.email-title').textContent.toLowerCase();
        const meta = item.querySelector('.email-meta').textContent.toLowerCase();

        if (title.includes(searchTerm) || meta.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Set logged-in user
ipcRenderer.invoke('get-user-info').then((userInfo) => {
    if (userInfo && userInfo.email) {
        loggedInUserElement.textContent = `Currently Logged In As: ${userInfo.email}`;
    }
});

// Initial fetch
updateActiveFolder();
fetchEmails();
