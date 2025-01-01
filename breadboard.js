document.addEventListener("DOMContentLoaded", function () {
    const refreshButton = document.getElementById("refreshButton");
    const logoutButton = document.getElementById("logoutButton");
    const emailList = document.getElementById("emailList");
    const emailContent = document.getElementById("emailContent");
    const loggedInUser = document.getElementById("loggedInUser");
    const folderButtons = document.querySelectorAll(".folder-button");

    const userEmail = localStorage.getItem("loggedInUserEmail") || "unknown@example.com";

    // Display logged-in user
    if (loggedInUser) {
        loggedInUser.textContent = `Logged in as: ${userEmail}`;
    }

    // Update folder
    function updateFolder(folderName) {
        console.log(`Switched to folder: ${folderName}`);
        fetchEmails(folderName);
    }

    folderButtons.forEach((button) => {
        button.addEventListener("click", () => {
            updateFolder(button.id.replace("Button", ""));
        });
    });

    // Fetch emails
    async function fetchEmails(folder = "inbox") {
        emailList.innerHTML = "<p>Refreshing...</p>";
        try {
            const emails = await fetchMockEmails(folder);
            emailList.innerHTML = "";

            if (emails.length === 0) {
                emailList.innerHTML = `<p class="no-toast">You Currently Have No Toast</p>`;
            } else {
                emails.forEach((email) => {
                    const emailItem = document.createElement("div");
                    emailItem.className = "email-list-item";
                    emailItem.innerHTML = `
                        <div class="email-title">${email.subject}</div>
                        <div class="email-meta">${email.sender} - ${email.time}</div>
                    `;
                    emailItem.addEventListener("click", () => {
                        displayEmailContent(email);
                    });
                    emailList.appendChild(emailItem);
                });
            }
        } catch (error) {
            console.error("Failed to fetch emails:", error);
            emailList.innerHTML = "<p>Error fetching emails</p>";
        }
    }

    async function fetchMockEmails(folder) {
        // Mock email fetching logic for different folders
        const emailData = {
            inbox: [
                { subject: "Welcome!", sender: "admin@example.com", time: "10:30 AM", body: "Welcome to Mail-Bread!" },
            ],
            outbox: [],
            spam: [],
            trash: [],
        };
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(emailData[folder] || []);
            }, 1000);
        });
    }

    // Display email content
    function displayEmailContent(email) {
        emailContent.innerHTML = `
            <h2>${email.subject}</h2>
            <p><strong>From:</strong> ${email.sender}</p>
            <p><strong>Time:</strong> ${email.time}</p>
            <p>${email.body}</p>
        `;
    }

    // Refresh emails
    refreshButton.addEventListener("click", () => {
        fetchEmails();
    });

    // Logout
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("loggedInUserEmail");
        window.location.href = "index.html";
    });

    // Initial fetch
    fetchEmails();
});
