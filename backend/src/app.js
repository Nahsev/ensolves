const express = require("express")
const cors= require("cors")
const noteRoutes = require("./routes/note.routes")

const app = express()

app.use(cors());
app.use(express.json());
app.use("/notes", noteRoutes);


module.exports = app