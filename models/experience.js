const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  years: { type: Number }, // for how long
  role: { type: String }, // what position was held
  responsibilities: [{ type: String }], // duties performed
  experienceName: { type: String }, // project, activity, certification, work experience, etc
  location: { type: String } // where
});

const Experience = mongoose.model("experience", experienceSchema);

module.exports = Experience;