const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose=require("mongoose");
const helmet= require("helmet");
const session = require("express-session");
const cors = require('cors');
const axios = require("axios");
const ejs= require("ejs");
const logging=require("./middlewares/logging");
const userRouter=require("./routes/User");
const authRouter=require("./routes/auth");
const adminRouter=require("./routes/admin");




//2) set connection
mongoose.connect("mongodb+srv://ahhossam68:c2RmScIUYX0H3gsw@cluster0.ihphmxf.mongodb.net/GoGreen",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})
.then(()=>{
    console.log("connected to Database...")
})
.catch((err)=>{
    console.log(err)
});


//built in midlleware
app.use(
    session({
      secret: "your secret key",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true if using https
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600,
  credentials: true
}))

//user middleware(APPLICATION-LEVEL MIDDLEWARE)
//LOGIN
app.use(logging);


app.use("/api/",userRouter);
app.use("/api/login",authRouter);
app.use("/api/admin",adminRouter);


//app.use(errorMW);

const port =  10000 ;



app.listen(port,()=>{
    console.log(`listening to ${port}..`)
});
