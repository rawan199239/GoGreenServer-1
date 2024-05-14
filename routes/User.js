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
/*router.get("/months", async (req, res) => {
  try {
    const users = await User.find(); // Retrieve all users' monthly data
    const monthlyData = users.map((user) => ({
      january: user.january,
      february: user.february,
      march: user.march,
      april: user.april,
      may: user.may,
      june: user.june,
      july: user.july,
      august: user.august,
      september: user.september,
      october: user.october,
      november: user.november,
      december: user.december,
    }));
    res.status(200).json(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});


// 404 handler for undefined routes in this router
router.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});
*/


/*router.get('/:userId/packages', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId })
      .populate('packages')
      .exec();

    if (!user) {
      return res.status(404).send('User not found');
    }

    const userData = {
      january: user.january,
      february: user.february,
      march: user.march,
      april: user.april,
      may: user.may,
      june: user.june,
      july: user.july,
      august: user.august,
      september: user.september,
      october: user.october,
      november: user.november,
      december: user.december,
      kind: user.kind
      // add other fields as needed
    };

    // send userData to AI API
    axios.post('https://aa00-34-106-176-217.ngrok-free.app/packages_prediction', userData)
      .then(response => {
        console.log('Data sent to AI API successfully');
        res.status(200).send(response.data);
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error sending data to AI API');
      });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from database');
  }
});
*/




