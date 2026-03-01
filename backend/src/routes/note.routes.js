const express = require("express");
const router = express.Router();
const NoteController = require("../controlers/note.controler");

router.get("/", NoteController.getNotes);
router.get("/:id", NoteController.getNoteById);

router.post("/", NoteController.createNote);

router.put("/:id", NoteController.updateNote);

router.patch("/:id/archive", NoteController.archiveNote);
router.patch("/:id/unarchive", NoteController.unarchiveNote);

router.delete("/:id", NoteController.deleteNote);

module.exports = router;
