const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
  skills: [{type: String}],
  experienceIds: [{type: String}],
  blueprintIds: [{type: String}],
  highestEdu: { type: String },
  eduGpa: { type: Number },
});

const blueprintSchema = new mongoose.Schema({
  blueprintId: {type: String},

});

userSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) {
      return next();
  }

  bcrypt
      .hash(user.password, 10)
      .then((hash) => {
          user.password = hash;
          next();
      })
      .catch((error) => next(error));
});

userSchema.methods.checkPassword = function(inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};
const User = mongoose.model("user", userSchema);


module.exports = User;