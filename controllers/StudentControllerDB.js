const Student=require("../models/StudentModelDB");
//const asyncFunction=require("../middlewares/async");

//create student
let addNewStudent=(req,res)=>{
    let std=new Student({
        fn:req.body.fn,
        ln:req.body.ln,
        dept:req.body.dept,
        id:req.body.id
    });
    std.save().then(()=>{
        res.send(std);
    }).catch((err)=>{
        for(let e in err.errors){
            console.log(err.errors[e].message);
            res.status(400).send("bad request.. some field are missed")
        }
    });
}
//getStudentById
let getStudentById=async(req,res)=>{
    try{
 let std=  await Student.findById(req.params.id);
    if(!std) return res.status(404).send("Student with the given id was not found");
    res.send(std);
}catch(err){
    for(let e in err.errors){
        console.log(err.errors[e].message);
        res.status(400).send("bad request.. some field are missed")
    }
}
};


//getAllStudents
let getAllStudents=async(req,res)=>{
try{
let std=await Student.find().select({
fn:1,
ln:1,
id:1
}).sort({
id:-1
});
res.send(std);
}catch(err){
for(let e in err.errors){
    console.log(err.errors[e].message);
    res.status(400).send("bad request.. some field are missed")
}
}}

//ubdateStudent

let updateStudent= async(req,res)=>{
    try{
    let std=await Student.findOneAndUpdate(req.params.id,req.body,{
    returnOriginal:false
    });
    if(!std) return res.status(404).send("Student with the given id was not found");
    res.send(std);
}catch(err){
    for(let e in err.errors){
        console.log(err.errors[e].message);
        res.status(400).send("bad request.. some field are missed")
    }
}


};

//deleteStudent

let deleteStudentById=async(req,res)=>{
    try{
   let std= await Student.findByIdAndRemove(req.params.id);
   if(!std) return res.status(404).send("Student with the given id was not found");
    res.send(std);
}catch(err){
    for(let e in err.errors){
        console.log(err.errors[e].message);
        res.status(400).send("bad request.. some field are missed")
    }
}

};

module.exports={
addNewStudent,
getStudentById,
getAllStudents,
updateStudent,
deleteStudentById
}