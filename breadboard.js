
// breadboard.js

document.addEventListener("DOMContentLoaded", () => {
  const emailListContainer = document.getElementById("email-list");
  const refreshButton = document.getElementById("refresh-btn");
  const logoutButton = document.getElementById("logout-btn");
  const folderButtons = document.querySelectorAll(".folder-btn");

  // Placeholder email fetching function
  async function fetchEmails(folder = "INBOX") {
    emailListContainer.innerHTML = `<p>Loading ${folder}...</p>`;
    try {
      // Simulated email fetching
      const emails = [
        {
          id: 1,
          subject: "Welcome to Email Bread!",
          from: "admin@example.com",
          to: "user@example.com",
          date: "2024-12-31",
          content: "This is the content of the email with ID: 1.",
        },
      ];

      renderEmailList(emails);
    } catch (error) {
      emailListContainer.innerHTML = `<p>Error loading ${folder}: ${error.message}</p>`;
    }
  }

  function renderEmailList(emails) {
    emailListContainer.innerHTML = ""; // Clear existing emails
    if (emails.length === 0) {
      emailListContainer.innerHTML = "<p>No emails to display.</p>";
      return;
    }

    emails.forEach((email) => {
      const emailItem = document.createElement("div");
      emailItem.classList.add("email-item");
      emailItem.innerHTML = `
        <p><strong>${email.subject}</strong></p>
        <p>From: ${email.from} | Sent: ${email.date}</p>
      `;
      emailItem.addEventListener("click", () => {
        showEmailDetails(email);
      });
      emailListContainer.appendChild(emailItem);
    });
  }

  function showEmailDetails(email) {
    emailListContainer.innerHTML = `
      <h2>${email.subject}</h2>
      <p><strong>From:</strong> ${email.from}</p>
      <p><strong>To:</strong> ${email.to}</p>
      <p><strong>Date:</strong> ${email.date}</p>
      <hr>
      <p>${email.content}</p>
    `;
  }

  // Event Listeners
  refreshButton.addEventListener("click", () => fetchEmails());
  logoutButton.addEventListener("click", () => {
    // Redirect to login
    window.location.href = "index.html";
  });
  folderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const folder = button.getAttribute("data-folder");
      fetchEmails(folder);
    });
  });

  // Initial fetch
  fetchEmails();
});
