const mongoose = require("mongoose");
const User = require("./UserModel");

const packageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },  email: { type: String, required: true },
  package: { type: Number, validate: { validator: Number.isInteger, message: 'Package must be an integer' } },
});

/*packageSchema.pre("save", async function (next) {
  const user = await User.findById(this.userId);

  if (!user) {
    return next(new Error("User not found"));
  }
  this.email = user.email;
  next();
});*/

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;

/*const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  package: { type: Number, validate: { validator: Number.isInteger, message: 'Package must be an integer' } },
  // add other fields as needed
});

module.exports = mongoose.model('Package', packageSchema);
*/