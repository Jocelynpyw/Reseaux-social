const express = require("express");
const bodyParser = require("body-parser");
// lIENS vers mes routes
const userRoutes = require("./routes/user.routes.js");
// ici je fais appel a totes mes variables d'envirronnements
require("dotenv").config({ path: "./config/.env" });
// je fais reconnaitre ma base de donnee
require("./config/db.js");

const app = express();

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Les routes
app.use("/api/user", userRoutes);

// Le server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`votre server est pret sur le port ${PORT}`);
});
