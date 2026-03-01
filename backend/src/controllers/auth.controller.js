const AuthService = require("../services/auth.service");

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const { user, token } = await AuthService.login(username, password);
      res.json({ id: user.id, username: user.username, token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new AuthController();