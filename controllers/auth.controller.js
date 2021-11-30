const UserModel = require("../models/user.model.js");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors.utils.js");

// Creattion de la fonction qui genere les token
maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

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
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
});

// Pour la fonction singIn se loger bref se connecter

module.exports.signIn = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    console.log(user);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    // console.log(err);
    const errors = signInErrors(err);
    res.status(201).json({ errors });
  }
});

// pour la fonction lougout

module.exports.logout = expressAsyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});
