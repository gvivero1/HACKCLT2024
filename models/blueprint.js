const mongoose = require("mongoose");
const experience = require("./experience");
const Schema = mongoose.Schema;

const blueprintSchema = new Schema({
    blueprintId: {type: String},
    jobId: { type: Schema.ObjectId },
    experiences: [{ type: experience }]
});

const Blueprint = mongoose.model("blueprint", blueprintSchema);

module.exports = Blueprint;