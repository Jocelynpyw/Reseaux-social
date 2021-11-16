const UserModel = require("../models/user.model.js");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

module.exports.signUp = expressAsyncHandler(async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({
      pseudo: pseudo,
      email: email,
      password: bcrypt.hashSync(password, 8),
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    res.status(200).send({ err });
  }
});
