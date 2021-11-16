const UserModel = require("../models/user.model.js");
const ObjectID = require("mongoose").Types.ObjectId;
const expressAsyncHandler = require("express-async-handler");

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.params.id);
  }

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID Unnknown : " + err);
  }).select("-password");
};

//  mettre un User a jour

module.exports.updateUser = expressAsyncHandler(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.params.id);
  }

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },

      (err, docs) => {
        if (!err) return res.json(docs);
        // if (err) return res.status(500).json({ Message: err });
      }
    );
  } catch (err) {
    // return res
    //   .status(501)
    //   .json("Erreur  lors de la tentative de  mise a jour " + err);
    console.log(err);
  }
});

// Pourr supprimer un User

module.exports.deleteUser = expressAsyncHandler(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.params);
  }

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).send({ message: "Succefully deleted " });
  } catch (err) {
    res.status(400).json({ Message: err });
  }
});

// Pour la fonction Follow

module.exports.follow = expressAsyncHandler(async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  ) {
    return res.status(400).send("ID inconnu " + req.body.params);
  }

  try {
    //  Ajouter a la Liste des  Followers
    // console.log(idToFollow);

    UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    // Ajouter a la liste des following

    UserModel.findByIdAndUpdate(
      { _id: req.body.idToFollow },
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    // res.status(500).json({ Message: err });
    console.log(err);
  }
});

// Pour la fonction Unfollow

module.exports.unfollow = expressAsyncHandler(async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  ) {
    return res.status(400).send("ID inconnu " + req.body.params);
  }

  try {
    //  Ajouter a la Liste des  Followers

    await UserModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: { following: req.body.idToUnfollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );

    // Ajouter a la liste des following

    await UserModel.findByIdAndUpdate(
      { _id: req.body.idToUnfollow },
      {
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    console.log("voici l'erreur", err);
  }
});
