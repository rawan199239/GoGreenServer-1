const mongoose = require("mongoose");
const valid = require("validator");
const config = require("config");
const jwt = require("jsonwebtoken");

//create user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (val) => {
        return valid.isEmail(val);
      },
      message: "{VALUE} is not valid email",
    },
  },
  isAdmin: {
    type: Boolean,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  months: {
    january: {
      type: Number,
    },
    february: {
      type: Number,
    },
    march: {
      type: Number,
    },
    april: {
      type: Number,
    },
    may: {
      type: Number,
    },
    june: {
      type: Number,
    },
    july: {
      type: Number,
    },
    august: {
      type: Number,
    },
    september: {
      type: Number,
    },
    october: {
      type: Number,
    },
    november: {
      type: Number,
    },
    december: {
      type: Number,
    }
  },
  kind: {
    type: Number,
  },
  packages: {
    type: [{
      prediction: {
        type: Number
      }
    }],
    default: []
  }
});
userSchema.methods.genAuthToken=function(){
  const token = jwt.sign({usrid:this._id},config.get("jwtsec"));
    return token;
};
const User = mongoose.model("User", userSchema);

module.exports = User;

