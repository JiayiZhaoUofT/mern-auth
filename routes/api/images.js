const express = require("express");
const router = express.Router();
const User = require("../../models/User");
router.post("/newImage", (req, res) => {
  const userID = req.body.userID;
  const imageURL = req.body.imageURL;
  User.findById(userID)
    .then(user => {
      user.images.push({ url: imageURL });
      user.save().catch(err => res.send(500).send("not save"));
      return res.status(200).send("saved");
    })
    .catch(err => res.status(500).send("not saved", err));
});
router.get("/", (req, res) => {
  const userID = req.query.id;
  User.findById(userID)
    .then(user => {
      return res.status(200).send((data = { images: user.images }));
    })
    .catch(err => {
      console.log("get images error", err);
      res.status(500).send("images not found", err);
    });
});
module.exports = router;
