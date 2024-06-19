const express = require("express");
const router = express.Router();
const validator = require("../middlewares/AuthMWValidator");
const config = require("config");
const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", validator, async (req, res) => {
  try {
    // Find the user by email
    let user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(400).send("Invalid email or password..");
    }

    // Check if the password is valid
    const validPswrd = await bcrypt.compare(req.body.password, user.password);
    if (!validPswrd) {
      return res.status(400).send("Invalid email or password..");
    }

    // Generate a JWT token
    if (!config.get("jwtsec")) return res.status(500).send("Token is not defined");
    const token = user.genAuthToken();

    // Update user's consumption data for all 12 months
    const months = [
      "january", "february", "march", "april", "may", "june", 
      "july", "august", "september", "october", "november", "december"
    ];
    months.forEach(month => {
      user[month] = req.body[month];
    });

    // Save the updated user object
    await user.save();

    // Prepare the modified user object to send in the response
    const modifiedUser = {
      message: "success",
      _id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      address: user.address,
      packages:user.packages,
      kind: user.kind,
      // Include the updated consumption data
      months: months.map(month => ({ month: month, count: user[month] }))
    };

    // Respond with success message, modified user object, and token
    return res.status(201).send({
      message: "success",
      user: modifiedUser,
      token: token
    });
  } catch (err) {
    console.log("Error occurred:", err);
    for (let e in err.errors) {
      console.log(err.errors[e].message);
      res.status(400).send("Bad request..");
    }
  }
});

module.exports = router;
