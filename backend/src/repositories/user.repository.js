const User = require("../models/user.model");

class UserRepository {
  static async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  static async create(userData) {
    return await User.create(userData);
  }
}

module.exports = UserRepository;