
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Note = require("./note.model");
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = User;