const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blueprintSchema = new Schema({
    blueprintId: {type: String},
    jobId: { type: Schema.ObjectId },
    experienceIds: [{ type: Schema.ObjectId }],
    
});

const Blueprint = mongoose.model("blueprint", blueprintSchema);

module.exports = Blueprint;