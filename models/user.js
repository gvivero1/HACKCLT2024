const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const experience = require("./experience");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
  skills: [{type: String}], 
  experiences: [{type: experience}], // includes all the experience ids generated by this user for easy access
  blueprintIds: [{type: Schema.ObjectId}], // includes all the blueprint ids generated by this user for easy access
  highestEdu: { type: String }, // highschool, college, etc - name of degree
  eduGpa: { type: Number },
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

userSchema.methods.addExperience = function(expToAdd){
  let user = this;
  user.experiences.push(expToAdd);
};


const User = mongoose.model("user", userSchema);

module.exports = User;