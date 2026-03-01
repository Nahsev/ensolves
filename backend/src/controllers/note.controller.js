const NoteService = require("../services/note.service");

class NoteController {
  
async getNotes(req, res) {
  try {
    const userId = req.user?.id; 
    const notes = await NoteService.getAllNotes({ ...req.query, userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las notas" });
  }
}
  async getNoteById(req, res) {
    const note = await NoteService.getNoteById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
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
    const updated = await NoteService.updateNote(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
}
 async deleteNote(req, res) {
  try {const noteId = Number(req.params.id);
const deletedNote = await NoteService.deleteNote(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    
    res.status(200).json({ message: "Note deleted successfully" });

  } catch (err) {
    console.error("Error deleting note:", err);

    
    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ message: "Cannot delete note: has related records" });
    }

    res.status(500).json({ message: "Error deleting note" });
  }
}
 async archiveNote(req, res) {
  try {
    const note = await NoteService.archiveNote(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error al archivar la nota" });
  }
}

async unarchiveNote(req, res) {
  try {
    const note = await NoteService.unarchiveNote(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error al desarchivar la nota" });
  }
}
}

module.exports = new NoteController();
