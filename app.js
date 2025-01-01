// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("emailForm");
    const showPasswordCheckbox = document.getElementById("showPassword");
    const passwordField = document.getElementById("password");
    const loadingMessage = document.getElementById("loading");
    const statusMessage = document.getElementById("status");

    // Show password functionality
    showPasswordCheckbox.addEventListener("change", () => {
        if (showPasswordCheckbox.checked) {
            passwordField.type = "text";
        } else {
            passwordField.type = "password";
        }
    });

    // Handle form submission
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        loadingMessage.style.display = "block"; // Show the loading message
        statusMessage.textContent = ""; // Clear any previous status message

        // Collect form data
        const email = document.getElementById("username").value;
        const password = passwordField.value;
        const imapServer = document.getElementById("server").value;
        const port = document.getElementById("port").value;
        const ssl = document.getElementById("ssl").checked;

        if (!email || !password || !imapServer || !port) {
            loadingMessage.style.display = "none";
            statusMessage.textContent = "All fields are required!";
            return;
        }

        try {
            // Simulate a login API call (replace with actual logic)
            const loginResponse = await fakeLoginAPI(email, password, imapServer, port, ssl);

            if (loginResponse.success) {
                // Redirect to the breadboard/dashboard
                window.location.href = "breadboard.html";
            } else {
                throw new Error(loginResponse.message);
            }
        } catch (error) {
            statusMessage.textContent = `Login failed: ${error.message}`;
        } finally {
            loadingMessage.style.display = "none";
        }
    });

    // Mock login function (Replace this with your actual backend API call)
    function fakeLoginAPI(email, password, imapServer, port, ssl) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email === "test@example.com" && password === "password123") {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: "Invalid credentials or server error." });
                }
            }, 2000); // Simulate a delay for API response
        });
    }
});
