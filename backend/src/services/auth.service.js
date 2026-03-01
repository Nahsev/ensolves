const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  async register(username, password) {
    const existing = await User.findOne({ where: { username } });
    if (existing) throw new Error("Usuario ya existe");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    return user;
  }

  async login(username, password) {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new Error("Usuario o contraseña incorrecta");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Usuario o contraseña incorrecta");

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return { user, token };
  }
}

module.exports = new AuthService();