document.getElementById("showPassword").addEventListener("change", function () {
    const passwordField = document.getElementById("password");
    passwordField.type = this.checked ? "text" : "password";
});

document.getElementById("emailForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    document.getElementById("loading").style.display = "block";
    document.getElementById("status").textContent = "";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const server = document.getElementById("server").value;
    const port = document.getElementById("port").value;
    const ssl = document.getElementById("ssl").checked;

    try {
        const emails = await fetchEmails(username, password, server, port, ssl);
        localStorage.setItem("emails", JSON.stringify(emails));
        window.location.href = "breadboard.html";
    } catch (error) {
        document.getElementById("status").textContent = `Login failed: ${error.message}`;
    } finally {
        document.getElementById("loading").style.display = "none";
    }
});

async function fetchEmails(username, password, server, port, ssl) {
    // Mock function to simulate IMAP fetching
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username && password && server) {
                resolve([
                    { subject: "Welcome!", from: "admin@example.com", date: new Date() },
                ]);
            } else {
                reject(new Error("Invalid credentials"));
            }
        }, 2000);
    });
}
