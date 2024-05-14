const { info } = require("console");
const { json } = require("express");
const fs=require("fs");
const path = require("path");
const studentsPath=path.join(path.dirname(process.mainModule.filename),"data","Students.json");


module.exports=class Student {
    
    constructor({
        name:nm,
        dept
    }) {
        this.name=nm;
        this.dept=dept;
        
        
    }
    saveStudent(){
        //Students.push(this);
        //1)read from file
        fs.readFile(studentsPath,(err,info)=>{
            let Students=[];
            if(!err){
               Students= JSON.parse(info);

                //2)update data
                this.id =Students.length +1;
                Students.push(this);

                //3) write into file
                fs.writeFile(studentsPath,JSON.stringify(Students),(err)=>{console.log("error occured")});

            }
        });
       
        
    }
    static fetchAllStudents(callback){
        //return Students;
        fs.readFile(studentsPath,(err,info)=>{
            if(!err){
                callback(JSON.parse(info));
            }
            else callback ([]);
        })
    }
}