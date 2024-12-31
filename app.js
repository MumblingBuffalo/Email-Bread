const Imap = require('imap');
const { inspect } = require('util');

document.getElementById('emailForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent form refresh

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const imapServer = document.getElementById('imapServer').value;
  const port = parseInt(document.getElementById('port').value);
  const useSSL = document.getElementById('ssl').checked;

  // Update status
  document.getElementById('status').innerText = 'Connecting to IMAP server...';

  // Clear existing debug info
  console.clear();

  console.log('Form data submitted:', { username, imapServer, port, useSSL });

  // Connect to IMAP
  connectToIMAP(username, password, imapServer, port, useSSL);
});

function connectToIMAP(user, pass, host, port, ssl) {
  const imap = new Imap({
    user: user,
    password: pass,
    host: host,
    port: port,
    tls: ssl, // SSL Checkbox
  });

  imap.once('ready', function () {
    document.getElementById('status').innerText = 'Connected to IMAP server! Fetching emails...';
    console.log('IMAP connection ready.');

    // Open the inbox
    imap.openBox('INBOX', false, function (err, box) {
      if (err) {
        document.getElementById('status').innerText = 'Error opening inbox: ' + err.message;
        console.error('Error opening inbox:', err);
        return;
      }
      console.log('Mailbox opened:', box);
      fetchEmails(imap);
    });
  });

  imap.once('error', function (err) {
    document.getElementById('status').innerText = 'IMAP Error: ' + err.message;
    console.error('IMAP Error:', err);
  });

  imap.once('end', function () {
    console.log('IMAP connection ended.');
    document.getElementById('status').innerText = 'Connection closed.';
  });

  try {
    console.log('Connecting to IMAP...');
    imap.connect();
  } catch (error) {
    console.error('IMAP connection error:', error);
    document.getElementById('status').innerText = 'Error connecting to IMAP server.';
  }
}

function fetchEmails(imap) {
  imap.search(['ALL'], function (err, results) {
    if (err) {
      document.getElementById('status').innerText = 'Error searching emails: ' + err.message;
      console.error('Error searching emails:', err);
      return;
    }

    const fetch = imap.fetch(results, { bodies: '' });
    fetch.on('message', function (msg, seqno) {
      console.log('Message #%d', seqno);

      msg.on('body', function (stream, info) {
        let buffer = '';
        stream.on('data', function (chunk) {
          buffer += chunk.toString();
        });

        stream.once('end', function () {
          console.log('Email body:', inspect(buffer));
        });
      });
    });

    fetch.once('end', function () {
      console.log('Done fetching emails.');
      imap.end();
    });
  });
}
