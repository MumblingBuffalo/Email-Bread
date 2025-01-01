const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { simpleParser } = require("mailparser");
const Imap = require("imap");

let mainWindow;

// Create main window
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("index.html");
});

// Logout
ipcMain.on("logout", (event) => {
    mainWindow.loadFile("index.html");
});

// Get emails
ipcMain.handle("get-emails", async (event, folder) => {
    const imap = new Imap({
        user: "your-email@example.com", // Update with your email
        password: "your-password", // Update with your password
        host: "imap.example.com", // Update with your IMAP server
        port: 993,
        tls: true,
    });

    return new Promise((resolve, reject) => {
        imap.once("ready", () => {
            imap.openBox(folder, true, (err, box) => {
                if (err) return reject(err);

                const emails = [];
                const fetch = imap.seq.fetch("1:*", { bodies: "" });

                fetch.on("message", (msg) => {
                    msg.on("body", (stream) => {
                        simpleParser(stream, (err, parsed) => {
                            if (!err) {
                                emails.push({
                                    subject: parsed.subject,
                                    from: parsed.from.text,
                                    date: parsed.date,
                                    body: parsed.text,
                                });
                            }
                        });
                    });
                });

                fetch.once("end", () => {
                    imap.end();
                    resolve(emails);
                });
            });
        });

        imap.once("error", (err) => reject(err));
        imap.connect();
    });
});
