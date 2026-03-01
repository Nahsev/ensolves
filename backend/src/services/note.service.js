const noteRepository = require("../repositories/note.repository");

class NoteService {

  async getAllNotes(filters) {
  return await noteRepository.findWithFilters(filters);
}

  async getNoteById(id) {
    return await noteRepository.findById(id);
  }

  async createNote(data) {
    return await noteRepository.create(data);
  }

  async updateNote(id, data) {
    const note = await noteRepository.findById(id);
    if (!note) return null;

    return await noteRepository.update(note, data);
  }
async deleteNote(id) {
  
  const note = await noteRepository.findById(id);
  if (!note) return null;

  try {
    
    await noteRepository.deleteNote(id); 
  } catch (err) {
    console.error("DB delete error:", err);
    throw err; 
  }
}

  async archiveNote(id) {
    const note = await noteRepository.findById(id);
    if (!note) return null;

    return await noteRepository.update(note, { archived: true });
  }

  async unarchiveNote(id) {
    const note = await noteRepository.findById(id);
    if (!note) return null;

    return await noteRepository.update(note, { archived: false });
  }
}

module.exports = new NoteService();