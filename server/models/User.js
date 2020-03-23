const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  gender: String,
  country: String,
  password: String,
  userImage: String,
  provider: String,
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image"
    }
  ]
});
userSchema.index({ email: 1 });
userSchema.methods.validPassword = async function(pwd) {
  try {
    return await bcrypt.compare(pwd, this.password);
  } catch (error) {
    console.log(error);
  }
};

module.exports = new mongoose.model("User", userSchema);
