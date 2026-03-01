const NoteService = require("../services/note.service");

class NoteController {
  
async getNotes(req, res) {
  try {
   
    const notes = await NoteService.getAllNotes(req.query); 
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

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await NoteService.createNote({
      title,
      content,
      tags: tags || []  
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
  try {
    const deletedNote = await NoteService.deleteNote(req.params.id);

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
  const note = await NoteService.archiveNote(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json(note);
}

async unarchiveNote(req, res) {
  const note = await NoteService.unarchiveNote(req.params.id);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json(note);
}
}

module.exports = new NoteController();
