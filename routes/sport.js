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
  .post("/post", upload.single("image"), async (req, res) => {
    // post pour envoyer les données a mongodb & cloudinary
    if (req.file) {
      try {
        var resultImage = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.image = resultImage.secure_url;
        req.body.imageId = resultImage.public_id;
      } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
    }
    new sportSchema(req.body)
      .save()
      .then(result => {
        req.flash("success", "You save an project");
        res.redirect("/sport");
      })
      .catch(err => console.log(err));
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
  .put("/modify/:id", upload.single("image"), (req, res) => {
    // post pour modifier les données a mongodb
    sportSchema
      .findById(req.params.id)
      .then(async result => {
        console.log(req.body);
        if (req.file) {
          try {
            await cloudinary.v2.uploader.destroy(result.imageId);
            var resultImage = await cloudinary.v2.uploader.upload(
              req.file.path
            );
            req.body.image = resultImage.secure_url;
            req.body.imageId = resultImage.public_id;
          } catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
        }
        result.title = req.body.title;
        result.description = req.body.description;
        result.save();
        req.flash("success", "You update an project");
        res.redirect("/sport");
      })
      .catch(err => console.log(err));
  });

// delete un sport
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  sportSchema
    .findByIdAndDelete(id)
    .then(result => {
      const img = result.image.substring(
        result.image.lastIndexOf("/") + 1,
        result.image.lastIndexOf(".")
      );
      cloudinary.uploader.destroy(img, imageDelete => {
        req.flash("success", "You delete an project");
        res.redirect("/sport/");
      });
    })
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
