const Imap = require('imap');
const { inspect } = require('util');

console.log('Script loaded'); // Ensure script runs

// Attach event listener to the form
document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form clearing and page reload
  console.log('Form submitted'); // Debugging log

  // Get form values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const imapServer = document.getElementById('imapServer').value;
  const port = parseInt(document.getElementById('port').value);
  const ssl = document.getElementById('ssl').checked;

  console.log('User input:', { username, password, imapServer, port, ssl });

  // Update status
  document.getElementById('status').innerText = 'Connecting...';

  // Call the function to connect to IMAP
  connectToIMAP(username, password, imapServer, port, ssl);
});

// Function to connect to the IMAP server
function connectToIMAP(user, pass, host, port, useSSL) {
  const imap = new Imap({
    user: user,           // User's email address
    password: pass,       // User's password (or app password if two-factor authentication is enabled)
    host: host,           // IMAP server address (e.g., 'mail.domain.com')
    port: port,           // IMAP server port (usually 993 for SSL)
    tls: useSSL,          // SSL checkbox value
  });

  // IMAP connection ready
  imap.once('ready', function() {
    document.getElementById('status').innerText = 'Connected to IMAP server. Fetching emails...';
    console.log('Connected to IMAP server.');

    // Open the inbox
    imap.openBox('INBOX', false, function(err, box) {
      if (err) {
        document.getElementById('status').innerText = 'Error opening inbox: ' + err.message;
        console.error('Error opening inbox:', err);
        return;
      }
      console.log('Mailbox opened:', box);
      fetchEmails(imap);
    });
  });

  // Handle IMAP errors
  imap.once('error', function(err) {
    document.getElementById('status').innerText = 'IMAP Error: ' + err.message;
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
      console.error('Error searching emails:', err);
      return;
    }

    const fetch = imap.fetch(results, { bodies: '' });
    fetch.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);

      const prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        let buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString();
        });

        stream.once('end', function() {
          console.log(prefix + 'Body: ' + inspect(buffer));
        });
      });
    });

    fetch.once('end', function() {
      console.log('Done fetching messages.');
      imap.end();
    });
  });
}
