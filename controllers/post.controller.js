const PostModel = require("../models/post.model");
const userModel = require("../models/user.model.js");
const ObjectID = require("mongoose").Types.ObjectId;
const expressAsyncHandler = require("express-async-handler");

module.exports.readPost = (req, res) => {
  postModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  });
};
module.exports.createPost = expressAsyncHandler(async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
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
module.exports.deletePost = (req, res) => {};
module.exports.updatePost = (req, res) => {};
