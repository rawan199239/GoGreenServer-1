const express=require("express");
const router=express.Router();
const {
    User 
   } = require("../models/UserModel");
   const auth=require("../middlewares/AuthMWPermission");
//update
router.put("/:id",auth,(req,res)=>{
    User.findByIdAndUpdate({_id:req.params.id},{isAdmin:true},function(err,data){
        if(!err){
            if(data)
            res.status(200).send("User Role is set to Admin..")
            else
            res.status(400).send("User not found..")
        }
        else{
            res.status(500).send("Internal Server Error..")
        }
    });
});





module.exports=router;