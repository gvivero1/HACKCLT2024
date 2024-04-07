const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    description: { type: String }, 
    qualifications: { type: String }, 
    position: { type: String }, // role to fill

});

const Job = mongoose.model("job", jobSchema);

module.exports = Job;