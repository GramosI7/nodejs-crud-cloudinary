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

router
  .get("/post", (req, res) => {
    // rendre la page ejs qui contient le formulaire d'ajout de sport
    res.render("postSport");
  })
  .post("/post", upload.single("image"), (req, res) => {
    // post pour envoyer les données a mongodb
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
router
  .get("/modify/:id", (req, res) => {
    // rendre la page ejs qui contient le formulaire de modification d'un sport
    sportSchema
      .findById(req.params.id)
      .then(result =>
        res.render("modifySport", { idVariable: req.params.id, result })
      )
      .catch(err => console.log(err));
  })
  .put("/modify/:id", (req, res) => {
    // post pour modifier les données a mongodb
    // modify
    sportSchema
      .findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
      .then(result => res.redirect("/sport"))
      .catch(err => console.log(err));
  });

// delete un sport
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  sportSchema
    .findByIdAndDelete(id)
    .then(result => res.redirect("/sport/"))
    .catch(err => console.log(err));
});

router.get("/:id", (req, res) => {
  sportSchema
    .findById(req.params.id)
    .then(result => {
      res.render("sport", { result });
    })
    .catch(err => console.log(err));
});

module.exports = router;
