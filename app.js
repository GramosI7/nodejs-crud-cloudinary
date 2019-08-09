const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
require("dotenv").config();

app.get("/", (req, res) => {
  res.render("welcome");
});

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.use("/sport", require("./routes/sport"));

mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true })
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

app.listen(4000, console.log("Le serveur tourne !"));
