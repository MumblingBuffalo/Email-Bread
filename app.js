const Imap = require('imap');
const { inspect } = require('util');

document.getElementById('emailForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Get field values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const imapServer = document.getElementById('imapServer').value;
  const port = parseInt(document.getElementById('port').value);
  const useSSL = document.getElementById('ssl').checked;

  console.log("Form Data Captured:", { username, password, imapServer, port, useSSL });

  // Clear any previous status
  document.getElementById('status').innerText = 'Connecting...';

  // Call the IMAP connection function
  connectToIMAP(username, password, imapServer, port, useSSL);
});

function connectToIMAP(user, pass, host, port, useSSL) {
  console.log("Attempting to connect to IMAP...");
  const imap = new Imap({
    user: user,
    password: pass,
    host: host,
    port: port,
    tls: useSSL,
  });

  // IMAP ready event
  imap.once('ready', function() {
    console.log("IMAP Connected successfully!");
    document.getElementById('status').innerText = 'Connected to IMAP server. Fetching emails...';

    imap.openBox('INBOX', false, function(err, box) {
      if (err) {
        document.getElementById('status').innerText = 'Error opening inbox: ' + err.message;
        console.error("Error opening inbox:", err);
        return;
      }
      console.log('Mailbox opened:', box);
      fetchEmails(imap);
    });
  });

  // IMAP error event
  imap.once('error', function(err) {
    console.error("IMAP Error:", err);
    document.getElementById('status').innerText = 'IMAP Error: ' + err.message;
  });

  // IMAP end event
  imap.once('end', function() {
    console.log("IMAP Connection ended.");
    document.getElementById('status').innerText = 'Connection closed.';
  });

  // Connect to IMAP
  imap.connect();
}

function fetchEmails(imap) {
  imap.search(['ALL'], function(err, results) {
    if (err) {
      console.error("Error searching emails:", err);
      document.getElementById('status').innerText = 'Error searching emails: ' + err.message;
      return;
    }

    if (!results.length) {
      document.getElementById('status').innerText = 'No emails found.';
      console.log('No emails found.');
      imap.end();
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
