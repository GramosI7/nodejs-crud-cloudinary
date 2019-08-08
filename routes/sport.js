const express = require("express");
const router = express.Router();
const sportSchema = require("../models/sport-model");

// route de tous les sport
router.get("/", (req, res) => {
  sportSchema
    .find()
    .then(result => {
      res.render("allSport", { sports: result });
      //   console.log(result);
    })
    .catch(err => console.log(err));
});

// get formulaire
router.get("/post", (req, res) => {
  res.render("postSport");
});

// post sport
router.post("/post", (req, res) => {
  const sport = new sportSchema(req.body);
  sport
    .save()
    .then(result => console.log(result))
    .catch(err => console.log(err));
});

// get formulaire
router.get("/modify/:id", (req, res) => {
  const id = req.params.id;
  res.render("modifySport", { idVariable: id });
});

// modify
router.post("/modify/:id", (req, res) => {
  const id = req.params.id;
  const sportModify = {
    title: req.body.title,
    description: req.body.description
  };
  sportSchema
    .findByIdAndUpdate({ _id: id }, { $set: sportModify }, { new: true })
    .then(result => console.log(result))
    .catch(err => console.log(err));
});

// delete sport
router.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  sportSchema
    .findByIdAndDelete(id)
    .then(result => console.log(result))
    .catch(err => console.log(err));
});

module.exports = router;
