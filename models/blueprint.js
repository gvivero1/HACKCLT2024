const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blueprintSchema = new Schema({
    blueprintId: {type: String},
  
});

const Blueprint = mongoose.model("blueprint", blueprintSchema);

module.exports = Blueprint;