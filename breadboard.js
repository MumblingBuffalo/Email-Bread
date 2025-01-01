const imap = require('imap-simple');

let userSession = null; // Holds session data for the logged-in user

// Function to initialize IMAP connection
async function initializeIMAP(username, password, server, port, ssl) {
    const config = {
        imap: {
            user: username,
            password: password,
            host: server,
            port: parseInt(port),
            tls: ssl,
            authTimeout: 3000
        }
    };

    return await imap.connect(config);
}

// Fetch emails
async function fetchEmails(imapConnection) {
    try {
        await imapConnection.openBox('INBOX');
        const searchCriteria = ['ALL'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true };
        const messages = await imapConnection.search(searchCriteria, fetchOptions);

        // Map messages to a simpler format
        return messages.map(msg => {
            const parts = imap.getParts(msg.attributes.struct);
            const headers = imap.parseHeader(msg.parts.find(part => part.which === 'HEADER').body);
            return {
                subject: headers.subject ? headers.subject[0] : 'No Subject',
                from: headers.from ? headers.from[0] : 'Unknown Sender',
                date: headers.date ? headers.date[0] : 'Unknown Date',
                body: parts.find(part => part.disposition === null)?.body || 'No content available'
            };
        });
    } catch (error) {
        console.error('Error fetching emails:', error);
        return [];
    }
}

// Display emails on the Breadboard
function displayEmails(emails) {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = ''; // Clear the list

    emails.forEach(email => {
        const listItem = document.createElement('div');
        listItem.className = 'email-list-item';
        listItem.innerHTML = `
            <div class="email-title">${email.subject}</div>
            <div class="email-meta">From: ${email.from} | Sent: ${email.date}</div>
        `;

        listItem.addEventListener('click', () => {
            const emailContent = document.getElementById('emailContent');
            emailContent.innerHTML = `
                <h2>${email.subject}</h2>
                <p><strong>From:</strong> ${email.from}</p>
                <p><strong>Sent:</strong> ${email.date}</p>
                <p>${email.body}</p>
            `;
        });

        emailList.appendChild(listItem);
    });
}

// Initialize the Breadboard page
async function initializeBreadboard() {
    const refreshButton = document.getElementById('refreshButton');
    const logoutButton = document.getElementById('logoutButton');

    // Fetch session info
    userSession = JSON.parse(sessionStorage.getItem('userSession'));

    if (!userSession) {
        alert('No active session. Redirecting to login page.');
        window.location.href = 'index.html';
        return;
    }

    // Display logged-in user
    const loggedInUser = document.getElementById('loggedInUser');
    loggedInUser.textContent = `Logged in as: ${userSession.username}`;

    // Initialize IMAP and load emails
    const imapConnection = await initializeIMAP(userSession.username, userSession.password, userSession.server, userSession.port, userSession.ssl);
    const emails = await fetchEmails(imapConnection);
    displayEmails(emails);

    // Add refresh functionality
    refreshButton.addEventListener('click', async () => {
        const emails = await fetchEmails(imapConnection);
        displayEmails(emails);
    });

    // Add logout functionality
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('userSession');
        window.location.href = 'index.html';
    });
}

// Start the Breadboard initialization on page load
document.addEventListener('DOMContentLoaded', initializeBreadboard);
