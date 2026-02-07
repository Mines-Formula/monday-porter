// index.js
const express = require("express");
const app = express();

// Use the port provided by the environment or default to 8080
const PORT = process.env.PORT || 8080;

// Basic route to verify it's running
app.get("/", (req, res) => {
  res.send("✅ Monday App is running successfully!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
