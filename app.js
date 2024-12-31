const Imap = require('imap');
const { inspect } = require('util');

document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const imapServer = document.getElementById('imapServer').value;
  const port = parseInt(document.getElementById('port').value);
  const ssl = document.getElementById('ssl').checked;

  // Update status and show loading
  document.getElementById('status').innerText = '';
  document.getElementById('loading').style.display = 'block';

  // Connect to IMAP with the user-provided credentials
  connectToIMAP(username, password, imapServer, port, ssl);
});

// Function to connect to the IMAP server
function connectToIMAP(user, pass, host, port, ssl) {
  const imap = new Imap({
    user: user,
    password: pass,
    host: host,
    port: port,
    tls: ssl,
  });

  // IMAP connection ready
  imap.once('ready', function() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('status').innerText = 'Connected to IMAP server. Fetching emails...';

    // Open the inbox
    imap.openBox('INBOX', false, function(err, box) {
      if (err) {
        document.getElementById('status').innerText = 'Error opening inbox: ' + err.message;
        throw err;
      }
      console.log('Mailbox opened:', box);
      fetchEmails(imap);
    });
  });

  // Handle IMAP errors
  imap.once('error', function(err) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('status').innerText = `IMAP Error: ${err.message}. Please check your credentials and server settings.`;
    console.error('IMAP Error:', err);
  });

  // IMAP connection ended
  imap.once('end', function() {
    console.log('Connection ended.');
    document.getElementById('status').innerText = 'Connection closed.';
  });

  // Start the connection
  imap.connect();
}

// Function to fetch emails from the inbox
function fetchEmails(imap) {
  imap.search(['ALL'], function(err, results) {
    if (err) {
      document.getElementById('status').innerText = 'Error searching emails: ' + err.message;
      throw err;
    }

    const fetch = imap.fetch(results, { bodies: '' });
    const emailList = document.createElement('ul'); // Create an email list container

    fetch.on('message', function(msg, seqno) {
      const emailItem = document.createElement('li');
      emailList.appendChild(emailItem);

      msg.on('body', function(stream, info) {
        let buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString();
        });

        stream.once('end', function() {
          emailItem.textContent = `Email #${seqno}: ${buffer}`;
        });
      });
    });

    fetch.once('end', function() {
      document.getElementById('status').innerText = 'Emails fetched successfully!';
      document.body.appendChild(emailList); // Display the email list
      imap.end();
    });
  });
}
