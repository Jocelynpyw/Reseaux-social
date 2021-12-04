const router = require("express").Router();
const authController = require("../controllers/auth.controller.js");
const userController = require("../controllers/user.controller.js");
const uploadController = require("../controllers/upload.controllers.js");
// Multer c'est la middleware qui permet de contrtoller l'image et la trainsition
const multer = require("multer");
const upload = multer();
// Authh
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user display ; 'BLOCK
router.get("/", userController.getAllUsers);
router.get("/:id", userController.userInfo);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.patch("/follow/:id", userController.follow);
router.patch("/unfollow/:id", userController.unfollow);

// Upload  Pour telecharger une photo de profil
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

module.exports = router;
