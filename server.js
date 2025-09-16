const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files (CSS, JS, images) from "dist" directory
app.use(express.static(path.join(__dirname, "dist")));

// Serve HTML files from "views" directory
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/services", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "services.html"));
});
app.get("/contact-us", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});
app.get("/about-us", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});
app.get("/gallery", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "gallery.html"));
});

app.use('/api',)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
