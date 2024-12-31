document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        window.location.href = "index.html"; // Redirect to login if not logged in
        return;
    }

    document.getElementById("loggedInUser").textContent = `Logged in as: ${loggedInUser}`;

    const emailList = document.getElementById("emailList");
    const emailContent = document.getElementById("emailContent");

    document.getElementById("refreshButton").addEventListener("click", () => {
        loadEmails();
    });

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "index.html"; // Logout and redirect to login
    });

    function loadEmails() {
        emailList.innerHTML = "<p>Loading emails...</p>"; // Placeholder
        setTimeout(() => {
            // Mock email loading
            emailList.innerHTML = `
                <div class="email-list-item" data-id="1">
                    <div class="email-title">Welcome to Email Bread</div>
                    <div class="email-meta">From: admin@example.com | Sent: 2024-12-31</div>
                </div>
            `;
            attachEmailEvents();
        }, 1000);
    }

    function attachEmailEvents() {
        document.querySelectorAll(".email-list-item").forEach((item) => {
            item.addEventListener("click", () => {
                const emailId = item.getAttribute("data-id");
                showEmailContent(emailId);
            });
        });
    }

    function showEmailContent(emailId) {
        emailContent.innerHTML = `
            <h2>Email Subject</h2>
            <p>This is the content of the email with ID: ${emailId}.</p>
        `;
    }

    loadEmails(); // Load emails initially
});
