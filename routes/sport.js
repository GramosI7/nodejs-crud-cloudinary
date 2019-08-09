const express = require("express");
const router = express.Router();
const multer = require("multer");
const sportSchema = require("../models/sport-model");

const storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var fileFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
});

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// route de tous les sport
router.get("/", (req, res) => {
  sportSchema
    .find()
    .then(result => {
      res.render("allSport", { sports: result });
    })
    .catch(err => console.log(err));
});

// get formulaire
router.get("/post", (req, res) => {
  res.render("postSport");
});

// post sport
router.post("/post", upload.single("image"), (req, res) => {
  cloudinary.uploader.upload(req.file.path, result => {
    req.body.image = result.secure_url;
    const sport = new sportSchema(req.body);
    sport
      .save()
      .then(result => {
        console.log(result);
        res.redirect("/sport");
      })
      .catch(err => console.log(err));
  });
});

// get formulaire
router.get("/modify/:id", (req, res) => {
  const id = req.params.id;
  sportSchema
    .findById(id)
    .then(result => res.render("modifySport", { idVariable: id, result }))
    .catch(err => console.log(err));
});

// modify
router.post("/modify/:id", (req, res) => {
  const id = req.params.id;
  sportSchema
    .findByIdAndUpdate({ _id: id }, req.body, { new: true })
    .then(result => res.redirect("/sport"))
    .catch(err => console.log(err));
});

// delete sport
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  sportSchema
    .findByIdAndDelete(id)
    .then(result => res.redirect("back"))
    .catch(err => console.log(err));
});

module.exports = router;
