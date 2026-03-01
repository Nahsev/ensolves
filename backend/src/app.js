const express = require("express")
const cors = require("cors")
const noteRoutes = require("./routes/note.routes")
const authRoutes = require("./routes/auth.routes");
const authMiddleware = require("./middleware/middleware");
const app = express()

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/notes", authMiddleware, noteRoutes);

module.exports = app