const express=require("express");
const router=express.Router();
const User=require("../models/UserModel");
const config = require("config");
/*console.log("User model:", User);*/
const validator=require("../middlewares/UserMWValidator");
const bcrypt=require("bcrypt");

//const { User } = require("../models/UserModel");

router.post("/Registration", validator, async (req, res) => {
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
     months: req.body.months,
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
router.get("/:userId/months", async (req, res) => {
  try {
    // Fetch the user by ID
    const user = await User.findById(req.params.userId, "-_id name months kind").exec();

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reformat months data to include kind as the last item
    const monthsData = { ...user.months, kind: user.kind };

    // Send the reformatted months data
    res.status(200).json(monthsData);
  } catch (err) {
    console.error("Error occurred while fetching months:", err);
    res.status(500).send("Internal Server Error: Unable to fetch months.");
  }
});
module.exports=router;



