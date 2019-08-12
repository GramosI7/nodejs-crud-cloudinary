const express = require("express");
const router = express.Router();
const multer = require("multer");
const sportSchema = require("../models/sport-model");

const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = function(req, file, cb) {
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

const cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET ALL SPORT
router.get("/", (req, res) => {
    sportSchema
        .find()
        .then(result => {
            res.render("allSport", { sports: result });
        })
        .catch(err => console.log(err));
});

// GET POST
router
    .get("/post", (req, res) => {
        res.render("postSport");
    })
    .post("/post", upload.single("image"), async (req, res) => {
        // POST
        const errors = [];
        const { title, description } = req.body;

        if (!title || !description) {
            errors.push({ msg: "Please fill in all fields" });
        }

        if (errors.length > 0) {
            res.render("postSport", {
                errors
            });
        } else {
            if (req.file) {
                try {
                    let resultImage = await cloudinary.v2.uploader.upload(
                        req.file.path
                    );
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
        }
    });

router.get("/:id", (req, res) => {
    sportSchema
        .findById(req.params.id)
        .then(result => {
            res.render("sport", { result });
        })
        .catch(err => console.log(err));
});

router
    .get("/:id/modify", (req, res) => {
        // GET MODIFY
        sportSchema
            .findById(req.params.id)
            .then(result =>
                res.render("modifySport", { idVariable: req.params.id, result })
            )
            .catch(err => console.log(err));
    })
    .put("/:id/modify", upload.single("image"), (req, res) => {
        // PUT MODIFY
        sportSchema.findById(req.params.id, async (err, sport) => {
            if (err) {
                req.flash("error", "error");
                res.redirect("back");
            }
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(sport.imageId);
                    let resultImage = await cloudinary.v2.uploader.upload(
                        req.file.path
                    );
                    sport.image = resultImage.secure_url;
                    sport.imageId = resultImage.public_id;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            sport.title = req.body.title;
            sport.description = req.body.description;
            sport.save();
            req.flash("success", "You update this sport");
            res.redirect(`/sport/${sport.id}`);
        });
    });

// DELETE
router.delete("/:id/delete/", (req, res) => {
    const id = req.params.id;
    sportSchema
        .findByIdAndDelete(id)
        .then(result => {
            cloudinary.v2.uploader.destroy(result.imageId, imageDelete => {
                req.flash("success", "You delete a sport");
                res.redirect("/sport/");
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;
