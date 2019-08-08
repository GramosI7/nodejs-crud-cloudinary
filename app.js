const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connection = mongoose.connection;

// ligne pour définir ejs
app.set("view engine", "ejs");

// ligne route
app.get("/", (req, res) => {
  res.send("Racine");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/sport", require("./routes/sport"));

mongoose
  .connect("mongodb://localhost:27017/mongodb-sport", { useNewUrlParser: true })
  .then(() => console.log("Mongo connected"))
  .catch(err => console.log(err));

app.listen(4000, console.log("Le serveur tourne !"));

// localhost:4000/modify
