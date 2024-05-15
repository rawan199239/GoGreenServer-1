const express=require("express");
const router=express.Router();
const User=require("../models/UserModel");
const config = require("config");
/*console.log("User model:", User);*/
const validator=require("../middlewares/UserMWValidator");
const bcrypt=require("bcrypt");

//const { User } = require("../models/UserModel");

router.post("/", validator, async (req, res) => {
  try {
    //check already
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user) return res.status(400).send({
      statusMsg: "fail",
      message: "Account Already Exists"
    });
  

    
    //create new user to be added to DB
    let salt = await bcrypt.genSalt(10);
    let hashedPswd = await bcrypt.hash(req.body.password, salt);
    user = new User({
      email: req.body.email,
      name: req.body.name,
      password: hashedPswd,
      phoneNumber:req.body.phoneNumber,
      address:req.body.address,
      january:req.body.january,
      february:req.body.february,
      march:req.body.march,
      april:req.body.april,
      may:req.body.may,
      june:req.body.june,
      july:req.body.july,
      august:req.body.august,
      september:req.body.september,
      october:req.body.october,
      november:req.body.november,
      december:req.body.december,
      kind:req.body.kind
    });
    
    await user.save();
    if(!config.get("jwtsec")) return res.status(500).send("token is not defined");
    const token =user.genAuthToken();
    res.setHeader("x-auth-token", token);
    //send res
    res.status(201).send(user);
  } catch (err) {
    console.log("Error occurred while creating user:", err);
    res.status(400).send("Bad Request: An error occurred while creating the user.");
  }
});
module.exports=router;



