// Merci mon Bon petit

// module.exports.updateUser = expressAsyncHandler(async (req, res) => {
//   if (!ObjectID.isValid(req.params.id)) {
//     return res.status(400).send("ID inconnu " + req.params.id);
//   }

//   try {
//     await UserModel.findById(req.params.id, function (err, docs) {
//       if (err) {
//         console.log(
//           "il ya erreur lors de la mise a jour de la bio et les cause sont: ",
//           err
//         );
//         res.json(err).status(500);
//       }
//       //Mettre a jour la bio d'un user
//       docs.bio = req.body.bio;

//       //Enregistrer la nouvelle bio et verifier les erreurs
//       docs.save(function (err) {
//         if (err) {
//           console.log("erreur lors de la sauvegarde de la nouvelle bio", err);
//           res.send(err).status(500);
//         }

//         //sinon la bio a bien ete sauvegarder

//         res.send(docs);
//       });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// });
