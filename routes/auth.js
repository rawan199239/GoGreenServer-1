const express = require("express");
const router = express.Router();
const validator = require("../middlewares/AuthMWValidator");
const config = require("config");
const User = require('../models/UserModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
router.post("/", validator, async (req, res) => {
  try {
    console.log("Inside the try block");
    let user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      console.log("User not found");
      return res.status(400).send("Invalid email or password..");
    }

    const validPswrd = await bcrypt.compare(req.body.password, user.password);
    if (!validPswrd) {
      console.log("Invalid password");
      return res.status(400).send("Invalid email or password..");
    }

    // If the user is found and the password is correct, create a session for the user
    req.session.user = user;
    req.session.isAuthenticated = true;

    // Generate a JWT token
    if(!config.get("jwtsec")) return res.status(500).send("token is not defined");
    const token = user.genAuthToken();
    console.log("Token:", token);
    res.setHeader("x-auth-token", token);
    //send res
    const modifiedUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      kind: user.kind,
      months: [
        { month: "january", count: user.january },
        { month: "february", count: user.february },
        { month: "march", count: user.march },
        { month: "april", count: user.april },
        { month: "may", count: user.may },
        { month: "june", count: user.june },
        { month: "july", count: user.july },
        { month: "august", count: user.august },
        { month: "september", count: user.september },
        { month: "october", count: user.october },
        { month: "november", count: user.november },
        { month: "december", count: user.december }
      ]
    };
    
    return res.status(200).send({
      message: "success",
      user: modifiedUser,
      token: token
    });
    /*console.log("Sending response");
    res.status(200).send({
      message: "success",
      user: {
       ...user, // spread operator to include all other user properties
        months: [
          { month: "january", count: user.january },
          { month: "february", count: user.february },
          { month: "march", count: user.march },
          { month: "april", count: user.april },
          { month: "may", count: user.may },
          { month: "june", count: user.june },
          { month: "july", count: user.july },
          { month: "august", count: user.august },
          { month: "september", count: user.september },
          { month: "october", count: user.october },
          { month: "november", count: user.november },
          { month: "december", count: user.december }
        ]
      },
      token: token
    });*/
  } catch (err) {
    console.log("Error occurred:", err);
    for (let e in err.errors) {
      console.log(err.errors[e].message);
      res.status(400).send("bad request..");
    }
  }
});

module.exports = router;






