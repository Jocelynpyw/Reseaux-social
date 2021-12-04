module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "pseudo incorrect ou deja pris";

  if (err.message.includes("email")) errors.email = "Email incorrect";

  if (err.message.includes("password"))
    errors.password = "Le mot de passe doit faire 6 caractere minimum";

  if (err.code === 11000) {
    {
      if (Object.keys(err.keyValue).includes("pseudo")) {
        errors.pseudo = "Ce pseudo est deja pris";
      }
      if (Object.keys(err.keyValue).includes("email")) {
        errors.email = "Cet email est deja enregistre";
      }
    }
  }

  // if (err.code === 11000 && Object.keys(err.KeyValue).includes("email"))
  //   errors.email = "Cet email est deja enregistre";

  return errors;
};

// Erreurs pendant le Login

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };
  if (err.message.includes("email")) {
    errors.email = "Email inconnu";
  }
  if (err.message.includes("password")) {
    errors.password = "Le mot de passe ne correspond pas ";
  }
  return errors;
};
// Erreurs Lors du telechargement

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("invalid file"))
    errors.format = "Format Incompatible";
  if (err.message.includes("max size"))
    errors.maxSize = "Le fihier a depasse les 50ko";
  return errors;
};
