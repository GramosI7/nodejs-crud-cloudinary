const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const flash = require("connect-flash");
require("dotenv").config();

mongoose.set("useFindAndModify", false);
mongoose
    .connect(process.env.MONGODB, { useNewUrlParser: true })
    .then(() => console.log("Mongo connected"))
    .catch(err => console.log(err));

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(
    require("express-session")({
        secret: "Once again Rusty wins cutest dog!",
        resave: false,
        saveUninitialized: false
    })
);

// Global variables
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("welcome");
});

app.use("/sport", require("./routes/sport"));

app.listen(4000, console.log("Le serveur tourne !"));
