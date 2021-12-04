const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// lIENS vers mes routes
const userRoutes = require("./routes/user.routes.js");
const postRoutes = require("./routes/post.routes.js");
// ici je fais appel a totes mes variables d'envirronnements
require("dotenv").config({ path: "./config/.env" });
// je fais reconnaitre ma base de donnee
require("./config/db.js");
const { checkUser, requireAuth } = require("./middleware/auth.middleware.js");
const cors = require("cors");

const app = express();

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,DELETE",
  prefLightContinue: false,
};
app.use(cors(corsOptions));

// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// jwt pour l'authentification
app.get("*", checkUser);
// app.get("/jwtid", requireAuth, (req, res) => {
//   res.status(200).send(res.locals.user._id);
// });
// Les routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Le server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`votre server est pret sur le port ${PORT}`);
});
