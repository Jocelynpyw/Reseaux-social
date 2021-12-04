const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model.js");
const ObjectID = require("mongoose").Types.ObjectId;
const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
  // .sort({ createdAt: -1 }) est pour trier les Posts du plus recent vers le plus ancien
};
module.exports.createPost = expressAsyncHandler(async (req, res) => {
  let fileName;
  if (req.file !== null) {
    try {
      if (
        req.file.detectedMineType !== "image/jpg" &&
        req.file.detectedMineType !== "image/png" &&
        req.file.detectedMineType !== "image/jpeg"
      ) {
        console.log("image non valide veuillez verifier le fornat");

        // throw Error("invalid file");
      }
      if (req.file.size > 500000) {
        throw Error("max size");
      }
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }

    fileName = req.body.posterId + Date.now() + ".jpg";
    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/upload/posts/${fileName}`
      )
    );
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file !== null ? ".upload/posts/" + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    console.log(err);
    return res.status(201).send(err);
  }
});

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unKnown : " + req.params.id);
  }
  // const updatedRecord = {
  //   message: req.body.message,
  // };

  try {
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: { message: req.body.message } },
      { new: true },
      (err, docs) => {
        if (!err) {
          res.send(docs);
          // console.log(typeof docs);
        } else {
          console.log("Update Error : " + err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports.deletePost = expressAsyncHandler(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.id);
  }

  try {
    await PostModel.remove({ _id: req.params.id }).exec();
    res.status(200).send({ message: "Succefully deleted " });
  } catch (err) {
    res.status(400).json({ Message: err });
  }
});

module.exports.likePost = expressAsyncHandler(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.id);
  }

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) {
          console.log(err);
          res.send(docs);
        } else return res.status(400).send(err);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});
module.exports.unlikePost = expressAsyncHandler(async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.id);
  }
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likers: req.body.id },
      },
      { new: true },
      (err, docs) => {
        if (err) return res.status(400).send(err);
      }
    );

    UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $pull: { likes: req.params.id },
      },
      { new: true },
      (err, docs) => {
        if (!err) {
          console.log(err);
          res.send(docs);
        } else return res.status(400).send(err);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
});

// Comments

module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.id);
  }

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comment: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.editCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.id);
  }

  try {
    PostModel.findById(req.params.id, (err, docs) => {
      const theComment = docs.comment.find((comment) =>
        comment._id.equals(req.body.commentId)
      );
      if (!theComment) res.status(400).send("Commennt Not Found");
      theComment.text = req.body.text;
      return docs.save((err) => {
        if (!err) return res.status(200).send(docs);
        return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};
module.exports.deleteCommentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu " + req.body.id);
  }

  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comment: {
            _id: req.body.commentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) return res.status(200).send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};
