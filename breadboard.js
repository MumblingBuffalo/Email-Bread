document.addEventListener("DOMContentLoaded", () => {
    const emailList = document.getElementById("emailList");
    const emailContent = document.getElementById("emailContent");
    const refreshButton = document.getElementById("refreshButton");
    const logoutButton = document.getElementById("logoutButton");
    const loggedInUser = document.getElementById("loggedInUser");

    // Fetch logged-in user's email
    const loggedInEmail = sessionStorage.getItem("loggedInEmail");
    if (loggedInEmail) {
        loggedInUser.textContent = `Logged in as: ${loggedInEmail}`;
    } else {
        window.location.href = "index.html";
    }

    // Dummy emails (replace with actual server-side logic)
    const emails = [
        { id: 1, title: "Welcome to Breadboard!", sender: "no-reply@example.com", time: "2024-12-31 10:00", body: "Welcome to the app!" },
        { id: 2, title: "Weekly Update", sender: "updates@example.com", time: "2024-12-30 14:00", body: "Here's your weekly update." },
        { id: 3, title: "Meeting Reminder", sender: "events@example.com", time: "2024-12-29 08:00", body: "Don't forget about the meeting!" }
    ];

    // Populate email list
    function loadEmails() {
        emailList.innerHTML = "";
        emails.forEach(email => {
            const emailItem = document.createElement("div");
            emailItem.classList.add("email-list-item");
            emailItem.dataset.id = email.id;
            emailItem.innerHTML = `
                <div class="email-title">${email.title}</div>
                <div class="email-meta">${email.sender} - ${email.time}</div>
            `;
            emailList.appendChild(emailItem);

            // Add click event to load email content
            emailItem.addEventListener("click", () => {
                emailContent.innerHTML = `
                    <h2>${email.title}</h2>
                    <p><strong>From:</strong> ${email.sender}</p>
                    <p><strong>Time:</strong> ${email.time}</p>
                    <p>${email.body}</p>
                `;
            });
        });
    }

    // Refresh button logic
    refreshButton.addEventListener("click", () => {
        loadEmails(); // Reload email list (replace with server call)
    });

    // Logout button logic
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("loggedInEmail");
        window.location.href = "index.html";
    });

    // Initial load
    loadEmails();
});
