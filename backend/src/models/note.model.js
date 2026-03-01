const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Note = sequelize.define("Note", {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  archived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
  userId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Note;