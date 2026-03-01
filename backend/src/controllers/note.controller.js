const NoteService = require("../services/note.service");

class NoteController {

  async getNotes(req, res) {
    try {
      const userId = req.user?.id;
      const notes = await NoteService.getAllNotes({ ...req.query, userId });
      res.json(notes);
    } catch (err) {
      res.status(500).json({ message: "Error fetching notes" });
    }
  }
  async getNoteById(req, res) {
    try {
      const userId = req.user?.id;
      const note = await NoteService.getNoteById(req.params.id);

      if (!note || note.userId !== userId) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (err) {
      res.status(500).json({ message: "Error fetching note" });
    }
  }




  async createNote(req, res) {
    try {
      const { title, content, tags } = req.body;
      const userId = req.user?.id;
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      const note = await NoteService.createNote({
        title,
        content,
        tags: tags || [],
        userId
      });

      res.status(201).json(note);
    } catch (err) {
      console.error("Error creating note:", err);
      res.status(500).json({ message: "Error creating note" });
    }
  }









  async updateNote(req, res) {
    try {
      const userId = req.user?.id;
      const note = await NoteService.getNoteById(req.params.id);

      if (!note || note.userId !== userId) {
        return res.status(404).json({ message: "Note not found" });
      }

      const updated = await NoteService.updateNote(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Error updating note" });
    }
  }
  async deleteNote(req, res) {
    try {
      const userId = req.user?.id;
      const noteId = Number(req.params.id);
      const note = await NoteService.getNoteById(noteId);

      if (!note || note.userId !== userId) {
        return res.status(404).json({ message: "Note not found" });
      }

      await NoteService.deleteNote(noteId);
      res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
      console.error("Error deleting note:", err);
      res.status(500).json({ message: "Error deleting note" });
    }
  }
  async archiveNote(req, res) {
    try {
      const userId = req.user?.id;
      const note = await NoteService.getNoteById(req.params.id);

      if (!note || note.userId !== userId) {
        return res.status(404).json({ message: "Note not found" });
      }

      const updatedNote = await NoteService.archiveNote(req.params.id);
      res.json(updatedNote);
    } catch (err) {
      res.status(500).json({ message: "Error archiving note" });
    }
  }

  async unarchiveNote(req, res) {
    try {
      const userId = req.user?.id;
      const note = await NoteService.getNoteById(req.params.id);

      if (!note || note.userId !== userId) {
        return res.status(404).json({ message: "Note not found" });
      }

      const updatedNote = await NoteService.unarchiveNote(req.params.id);
      res.json(updatedNote);
    } catch (err) {
      res.status(500).json({ message: "Error unarchiving note" });
    }
  }
}

module.exports = new NoteController();
