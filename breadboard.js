const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
    const refreshButton = document.getElementById("refreshButton");
    const logoutButton = document.getElementById("logoutButton");
    const folderButtons = document.querySelectorAll(".folder-button");

    // Default to Inbox on load
    let currentFolder = "inbox";
    loadEmails(currentFolder);

    // Handle folder switching
    folderButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            currentFolder = event.target.id;
            loadEmails(currentFolder);
        });
    });

    // Refresh emails
    refreshButton.addEventListener("click", () => {
        toggleLoading(true);
        loadEmails(currentFolder);
    });

    // Logout functionality
    logoutButton.addEventListener("click", () => {
        ipcRenderer.send("logout");
    });

    // Fetch emails for a folder
    async function loadEmails(folder) {
        toggleLoading(true);

        const emails = await ipcRenderer.invoke("get-emails", folder);

        toggleLoading(false);

        const emailList = document.querySelector(".email-list");
        emailList.innerHTML = ""; // Clear current emails

        if (emails.length === 0) {
            document.getElementById("noToast").style.display = "block";
        } else {
            document.getElementById("noToast").style.display = "none";
            emails.forEach(email => {
                const emailItem = document.createElement("div");
                emailItem.classList.add("email-list-item");
                emailItem.innerHTML = `
                    <div class="email-title">${email.subject}</div>
                    <div class="email-meta">${email.from} - ${email.date}</div>
                `;
                emailItem.addEventListener("click", () => displayEmail(email));
                emailList.appendChild(emailItem);
            });
        }
    }

    // Show email content
    function displayEmail(email) {
        document.getElementById("emailTitle").textContent = email.subject;
        document.getElementById("emailBody").textContent = email.body;
    }

    // Toggle loading indicator
    function toggleLoading(isLoading) {
        const loadingIndicator = document.getElementById("loading");
        loadingIndicator.style.display = isLoading ? "block" : "none";
    }
});
