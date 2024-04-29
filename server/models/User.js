const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the Name"],
    minlength: 3, // Corrected to 'minlength'
    maxlength: 50, // Corrected to 'maxlength'
  },
  email: {
    type: String,
    required: [true, "Please provide the Email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide the valid Email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide the password"],
    minlength: 8,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (pass) {
  const isMatch = await bcrypt.compare(pass, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
