document.addEventListener("DOMContentLoaded", function () {
    const emailList = document.getElementById("emailList");
    const emailContent = document.getElementById("emailContent");

    // Mock email data
    let emails = [
        { id: 1, subject: "Welcome to Breadboard!", body: "Hello, thank you for using our app!" },
        { id: 2, subject: "Weekly Update", body: "Here are the updates for this week..." },
        { id: 3, subject: "Meeting Reminder", body: "Don't forget about the meeting tomorrow at 10 AM." },
    ];

    // Function to render the email list
    function renderEmailList() {
        emailList.innerHTML = ""; // Clear the list
        emails.forEach(email => {
            const div = document.createElement("div");
            div.className = "email-item";
            div.textContent = email.subject;
            div.onclick = () => viewEmail(email);
            emailList.appendChild(div);
        });
    }

    // Function to display email content
    function viewEmail(email) {
        emailContent.innerHTML = `
            <h2>${email.subject}</h2>
            <p>${email.body}</p>
        `;
    }

    // Function to refresh the inbox (placeholder for real fetch logic)
    function refreshInbox() {
        emailContent.innerHTML = "<h2>Refreshing inbox...</h2>";
        setTimeout(() => {
            renderEmailList(); // Re-render the list after "refresh"
            emailContent.innerHTML = "<h2>Select an email to view its content</h2>";
        }, 1000); // Mock delay
    }

    // Initial render
    renderEmailList();
    window.refreshInbox = refreshInbox; // Expose refreshInbox to the button
});
