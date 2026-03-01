const Note = require("../models/note.model");
const { Op } = require("sequelize");

class NoteRepository {

  async findAll() {
    return await Note.findAll();
  }

  async findByArchived(value) {
    return await Note.findAll({
      where: { archived: value }
    });
  }

  async create(data) {
    return await Note.create(data);
  }

  async findById(id) {
    return await Note.findByPk(id);
  }

  async update(note, data) {
    return await note.update(data);
  }

  async deleteNote(id) {
  const note = await Note.findByPk(id);
  if (!note) return null;

  try {
    await note.destroy();
    return note;
  } catch (err) {
    console.error("DB delete error:", err);
    throw err; 
  }
}

async findWithFilters(filters) {
  const where = {};

  
  if (filters.archived === "true" || filters.archived === "false") {
    where.archived = filters.archived === "true";
  }

  

if (filters.tag) {
  const tagsArray = filters.tag.split(',').map(t => t.trim()).filter(t => t !== "");

  if (tagsArray.length > 0) {
    where.tags = {
      
      [Op.contains]: tagsArray 
    };
  }
}

  return await Note.findAll({ where });
}
  async findByTags(tagsString) {
  
  const tagsArray = tagsString.split(','); 
  
  return await Note.findAll({
    where: {
      tags: {
        [Op.overlap]: tagsArray 
 
      }
    }
  });
}
}
module.exports = new NoteRepository();
