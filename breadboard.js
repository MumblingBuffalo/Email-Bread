document.addEventListener("DOMContentLoaded", () => {
    const folders = {
        Inbox: "INBOX",
        Outbox: "OUTBOX",
        Sent: "SENT",
        "(Burnt Toast)": "TRASH"
    };

    const emailList = document.getElementById("email-list");
    const folderButtons = document.getElementById("folder-buttons");
    const loggedInEmail = document.getElementById("logged-in-email");

    // Show the current logged-in email
    loggedInEmail.textContent = sessionStorage.getItem("email") || "Unknown Email";

    // Render folder buttons dynamically
    folderButtons.innerHTML = Object.keys(folders)
        .map(folder => `<button data-folder="${folder}">${folder}</button>`)
        .join("");

    // Add event listeners to folder buttons
    folderButtons.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", (e) => {
            const folderName = folders[e.target.dataset.folder];
            loadEmails(folderName);
        });
    });

    // Load emails from the IMAP server using the fetchEmails.sh script
    const loadEmails = (folder) => {
        emailList.innerHTML = "<p>Loading emails...</p>";

        const email = sessionStorage.getItem("email");
        const password = sessionStorage.getItem("password");
        const imapServer = sessionStorage.getItem("imapServer");
        const port = sessionStorage.getItem("port");
        const enableSSL = sessionStorage.getItem("enableSSL");

        // Use fetchEmails.sh to get emails
        const command = `./fetchEmails.sh "${email}" "${password}" "${imapServer}" "${port}" "${folder}" "${enableSSL}"`;

        fetch(`/execute-command?command=${encodeURIComponent(command)}`)
            .then(response => response.json())
            .then(emails => {
                emailList.innerHTML = emails.length
                    ? emails.map(email => `<div class="email-item">${email}</div>`).join("")
                    : "<p>No emails found.</p>";
            })
            .catch(err => {
                console.error("Error loading emails:", err);
                emailList.innerHTML = "<p>Error loading emails.</p>";
            });
    };

    // Initial load
    loadEmails("INBOX");
});

