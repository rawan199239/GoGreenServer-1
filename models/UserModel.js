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
    default: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  address: {
    type: String,
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
  },consumption: {
    hourlyConsumption: [
      {
        hour: { type: String, required: true },
        consumption: { type: Number, required: true },
      },
    ],
    dailyConsumption: [
      {
        day: { type: String, required: true },
        consumption: { type: Number, required: true },
      },
    ],
    weeklyConsumption: [
      {
        week: { type: String, required: true },
        consumption: { type: Number, required: true },
      },
    ],
    monthlyConsumption: [
      {
        month: { type: String, required: true },
        consumption: { type: Number, required: true },
      },
    ],
    yearlyConsumption: [
      {
        year: { type: Number, required: true },
        consumption: { type: Number, required: true },
      },
    ],
  },
  predicted_consumptions: [
    {
      datetime: { type: Date, required: true },
      predicted_consumption: { type: Number, required: true },
    }
  ],
  kind: {
    type: Number,
  },
 packages: {
    prediction: { type: Number, default: 0 } // Define packages as an object with a single field
 }
});
userSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    {
      usrid: this._id,
      isAdmin: this.isAdmin
    },
    config.get("jwtsec")
    // ,{ expiresIn: '1h' } 
    // Optional: set token expiration time
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

