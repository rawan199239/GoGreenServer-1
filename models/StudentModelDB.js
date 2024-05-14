//1) require mongoose 
const mongoose=require("mongoose");

//3) create schema
const studentSchema=new mongoose.Schema({
fn:{
    type:String,
    required:true,
    minlength:3,
    maxlength:50,
    trim:true
},
ln:{
    type:String,
    required:true,
    minlength:3,
    maxlength:50,
    trim:true
},
dept:{
    type:String,
    required:true,
    default:"sd"
},
id:{
    type:Number,
    required:true,
}


});
//4) create model 
const Student=mongoose.model("Students",studentSchema);

module.exports=Student;