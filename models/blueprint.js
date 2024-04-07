const mongoose = require("mongoose");
const experience = require("./experience");
const Schema = mongoose.Schema;

const blueprintSchema = new Schema({
    blueprintName: { type: String },
    jobId: { type: Schema.ObjectId },
    experiences: [{ type: experience }],
    nextSteps: {type: String},
    position: { type: String },
});

const Blueprint = mongoose.model("blueprint", blueprintSchema);

module.exports = Blueprint;