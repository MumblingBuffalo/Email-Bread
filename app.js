document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("emailForm");
    const loading = document.getElementById("loading");
    const status = document.getElementById("status");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form submission

        // Clear previous status
        status.textContent = "";

        // Show the loading message
        loading.style.display = "block";

        // Collect form data
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const server = document.getElementById("server").value.trim();
        const port = document.getElementById("port").value.trim();
        const ssl = document.getElementById("ssl").checked;

        // Validate form data
        if (!username || !password || !server || !port) {
            loading.style.display = "none"; // Hide loading message
            status.textContent = "Please fill in all fields.";
            status.style.color = "red";
            return;
        }

        // Simulate a login process (Replace this with actual login logic)
        try {
            // Mocking async email login request
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Mock success or failure
                    Math.random() > 0.3 ? resolve() : reject(new Error("Login failed. Invalid credentials."));
                }, 2000);
            });

            // On success
            loading.style.display = "none";
            status.textContent = "Login successful!";
            status.style.color = "green";

            // Perform actions on successful login
            console.log("Logged in with:", { username, server, port, ssl });
        } catch (error) {
            // On failure
            loading.style.display = "none";
            status.textContent = error.message;
            status.style.color = "red";
        }
    });
});
