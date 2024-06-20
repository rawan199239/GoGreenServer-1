const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const mongoose=require("mongoose");
const helmet= require("helmet");
const session = require("express-session");
const cors = require('cors');
const axios = require("axios");
const bodyParser = require('body-parser');
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
app.use(bodyParser.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin : '*'}))


//user middleware(APPLICATION-LEVEL MIDDLEWARE)
//LOGIN
app.use(logging);

app.post("/api/user/:userId/insert-data", async (req, res) => {
    try {
        const userId = req.params.userId; // Get the user ID from the request params

        // Define the data to be inserted
        const newData = {
            consumption: {
                hourlyConsumption: [
                    { hour: '00:00', consumption: 10 },
                    { hour: '01:00', consumption: 15 },
                    { hour: '02:00', consumption: 8 },
                    { hour: '03:00', consumption: 12 },
                    { hour: '04:00', consumption: 16 },
                    { hour: '05:00', consumption: 10 },
                    { hour: '06:00', consumption: 14 },
                    { hour: '07:00', consumption: 20 },
                    { hour: '08:00', consumption: 18 },
                    { hour: '09:00', consumption: 22 },
                    { hour: '10:00', consumption: 24 },
                    { hour: '11:00', consumption: 20 },
                    { hour: '12:00', consumption: 25 },
                    { hour: '13:00', consumption: 28 },
                    { hour: '14:00', consumption: 30 },
                    { hour: '15:00', consumption: 25 },
                    { hour: '16:00', consumption: 22 },
                    { hour: '17:00', consumption: 18 },
                    { hour: '18:00', consumption: 20 },
                    { hour: '19:00', consumption: 16 },
                    { hour: '20:00', consumption: 14 },
                    { hour: '21:00', consumption: 12 },
                    { hour: '22:00', consumption: 10 },
                    { hour: '23:00', consumption: 8 }
                ],
                dailyConsumption: [
                    { day: 'Mon', consumption: 80 },
                    { day: 'Tue', consumption: 90 },
                    { day: 'Wed', consumption: 85 },
                    { day: 'Thu', consumption: 95 },
                    { day: 'Fri', consumption: 100 },
                    { day: 'Sat', consumption: 110 },
                    { day: 'Sun', consumption: 95 }
                ],
                weeklyConsumption: [
                    { week: 'Week 1', consumption: 625 },
                    { week: 'Week 2', consumption: 715 },
                    { week: 'Week 3', consumption: 700 }
                ],
                monthlyConsumption: [
                    { month: 'Jan', consumption: 500 },
                    { month: 'Feb', consumption: 520 },
                    { month: 'Mar', consumption: 480 },
                    { month: 'Apr', consumption: 550 },
                    { month: 'May', consumption: 540 },
                    { month: 'Jun', consumption: 580 },
                    { month: 'Jul', consumption: 600 },
                    { month: 'Aug', consumption: 620 },
                    { month: 'Sep', consumption: 580 },
                    { month: 'Oct', consumption: 560 },
                    { month: 'Nov', consumption: 540 },
                    { month: 'Dec', consumption: 530 }
                ],
                yearlyConsumption: [
                    { year: 2019, consumption: 6500 },
                    { year: 2020, consumption: 6800 },
                    { year: 2021, consumption: 6300 },
                    { year: 2022, consumption: 7000 },
                    { year: 2023, consumption: 7200 }
                ]
            }
        };

        // Update the user document with the new data
        await mongoose.model('User').updateOne({ _id: userId }, { $set: newData });

        res.status(200).json({ message: "Data inserted successfully" });
    } catch (error) {
        console.error("Error inserting data:", error.message);
        res.status(500).send("Internal Server Error: Failed to insert data.");
    }
});

app.use("/api/",userRouter);
app.use("/api/login",authRouter);
app.use("/api/admin",adminRouter);


//app.use(errorMW);

const port =  10000 ;



app.listen(port,()=>{
    console.log(`listening to ${port}..`)
});
