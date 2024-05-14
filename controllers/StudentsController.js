const validator=require("../util/StudentsValidator");
const Student=require("../models/StudentModel");



const getAllStudents=(req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    //res.json(Students);
    Student.fetchAllStudents((obj)=>{
        res.render("Students.ejs",{
            std: obj
        });
    });
   
};

const getStudentById=(req, res) => {
    // let id = req.params.id;
    console.log(req.params.id);
    let id=req.id;
     const std = Students.find((val, idx, arr) => {
         return val.id == id
     });
 
     if (std)
         res.json(std);
     else
         res.send("not found")
 };

 const createStudent=(req, res) => {
    let valid = validator(req.body);
    if (valid) {
        let std= new Student(req.body);
        std.saveStudent();
        res.json(req.body);
    }
    else {
        res.status(403).send("forbidden command");
    }
};

const deleteStudentById=(req, res) => {
    let idx = Students.findIndex((val) => {
        return val.id == req.params.id
    });
    if (idx != -1) {
        /* let deleteStd= */ Students.splice(idx, 1);
        res.send("one element affected")
    }
    else {
        res.send("student not found")
    }
};

const updateStudentById=(req, res) => {
    let idx = Students.findIndex((val) => {
        return val.id == req.params.id
    });
    if (idx != -1) {
        for (i in req.body) {
            Students[idx][i] = req.body[i];
        }
        res.json(Students[idx]);
    }
    else {
        res.send("student not found ...update is not allowed")
    }
};

module.exports={getAllStudents,getStudentById,createStudent,deleteStudentById,updateStudentById};