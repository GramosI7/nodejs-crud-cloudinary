const express = require("express");
const router = express.Router();
const sportSchema = require("../models/sport-model");

router.get("/", (req, res) => {
  res.render("allSport");
});

router.get("/post", (req, res) => {
  res.render("postSport");
});

router.post("/post", (req, res) => {
  const sport = new sportSchema(req.body);
  sport
    .save()
    .then(result => console.log(result))
    .catch(err => console.log(err));
});

module.exports = router;
