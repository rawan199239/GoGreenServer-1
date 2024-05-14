const express=require("express");
const router=express.Router();
const studentsController=require("../controllers/StudentControllerDB");
const stdValidator=require("../middlewares/StudentValidatorMW");
const auth=require("../middlewares/AuthMWPermission");
router.all("/", (req, res,nxt) => {
 
    console.log("request recieved on Students collection...")
    nxt();

});

//request all students
router.get("/", studentsController.getAllStudents);
//parameter middleware
router.param("id",(req,res,nxt,val)=>{
//validation of parameter
if(/^[0-9a-fA-F]{24}$/.test(val)){


//add param as property for req
req.id=val;
    nxt();
}
else{
    res.status(400).send("invalid id");
}
})

//request student by id
//passing data from client to server via url parameters
router.get("/:id",studentsController.getStudentById);
//create new student
router.post("/", stdValidator,auth,studentsController.addNewStudent);
//delete existing student
router.delete("/:id", auth,studentsController.deleteStudentById);
//update student
router.put("/:id", studentsController.updateStudent);

module.exports=router;