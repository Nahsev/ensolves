const UserService = require("../services/user.service");

class UserController {
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserService.createUser(username, password);
      res.status(201).json({ message: "User created", user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await UserService.loginUser(username, password);
      res.json({ message: "Login successful", user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = UserController;