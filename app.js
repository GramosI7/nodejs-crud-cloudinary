const express = require("express");
const app = express();
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

// ligne pour définir ejs
app.use(expressLayouts);
app.set("view engine", "ejs");

// ligne route
app.get("/", (req, res) => {
  res.render("welcome");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/sport", require("./routes/sport"));

mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true })
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

app.listen(4000, console.log("Le serveur tourne !"));

// localhost:4000/modify
