const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaSport = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  imageId: {
    type: String
  }
});

module.exports = mongoose.model("sport", schemaSport);
