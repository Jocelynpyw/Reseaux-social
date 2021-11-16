const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connexion a la base de donnee reussite"))
  .catch((err) => console.log("connexion Echec ", err));
