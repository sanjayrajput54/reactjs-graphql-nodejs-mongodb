const bcrypt = require("bcrypt");
const UserModel = require("../../models/user");
const jwt = require("jsonwebtoken");
module.exports = {
  createUser: async (args) => {
    try {
      const userExists = await UserModel.findOne({
        email: args.userInput.email
      });
      if (userExists) {
        throw new Error("User already exists");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const saveUser = new UserModel({
        email: args.userInput.email,
        password: hashedPassword
      });
      const result = await saveUser.save();
      return { ...result._doc, _id: result.id, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const isAuth = await bcrypt.compare(password, user.password);
      if (!isAuth) {
        throw new Error("Password does not match");
      }
      const token = jwt.sign(
        { userId: user.id, email: email },
        "supersecretkey",
        { expiresIn: "1h" }
      );
      return { userId: user.id, token: token, expirationTime: 1 };
    } catch (err) {
      throw err;
    }
  }
};
