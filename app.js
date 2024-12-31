document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("emailForm");
    const loading = document.getElementById("loading");
    const status = document.getElementById("status");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Clear status and show loading
        status.textContent = "";
        loading.style.display = "block";

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const server = document.getElementById("server").value.trim();
        const port = document.getElementById("port").value.trim();
        const ssl = document.getElementById("ssl").checked;

        if (!username || !password || !server || !port) {
            status.textContent = "Please fill in all fields.";
            status.style.color = "red";
            loading.style.display = "none";
            return;
        }

        try {
            // Mocking successful login
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
            loading.style.display = "none";
            status.textContent = "Login successful!";
            status.style.color = "green";

            // Save session and navigate to Breadboard
            sessionStorage.setItem("loggedInUser", username);
            window.location.href = "breadboard.html";
        } catch (error) {
            loading.style.display = "none";
            status.textContent = error.message || "Login failed.";
            status.style.color = "red";
        }
    });

    // Show/hide password toggle
    document.getElementById("showPassword").addEventListener("change", (e) => {
        const passwordField = document.getElementById("password");
        passwordField.type = e.target.checked ? "text" : "password";
    });
});
