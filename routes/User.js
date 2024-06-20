const express=require("express");
const router=express.Router();
const User=require("../models/UserModel");
const config = require("config");
const validator=require("../middlewares/UserMWValidator");
const bcrypt=require("bcrypt");
const axios = require("axios");

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
  const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      password: hashedPswd,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      months: req.body.months,
      kind: req.body.kind,
      isAdmin: req.body.isAdmin
    });

    // Save the new user using Mongoose's save() method
    const createdUser = await newUser.save();

    if(!config.get("jwtsec")) return res.status(500).send("token is not defined");
    const token =createdUser.genAuthToken();
    res.setHeader("x-auth-token", token);

    //send res
    res.status(201).send(createdUser);
  } catch (err) {
    console.log("Error occurred while creating user:", err);
    res.status(400).send("Bad Request: An error occurred while creating the user.");
  }
});
router.post("/:userId/saveHourlyConsumption", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { hour, consumption } = req.body;

    if (!hour || typeof consumption !== "number") {
      return res.status(400).send({ message: "Invalid data format" });
    }

    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.consumption.hourlyConsumption.push({ hour, consumption });

    const currentDay = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });
    const dayTotal = user.consumption.hourlyConsumption.reduce(
      (total, record) => total + record.consumption,
      0
    );
    user.consumption.dailyConsumption = user.consumption.dailyConsumption.filter(
      (record) => record.day !== currentDay
    );
    user.consumption.dailyConsumption.push({
      day: currentDay,
      consumption: dayTotal,
    });

    if (user.consumption.hourlyConsumption.length >= 24) {
      user.consumption.hourlyConsumption = [];
    }

    if (user.consumption.dailyConsumption.length === 7) {
      const weekTotal = user.consumption.dailyConsumption.reduce(
        (total, record) => total + record.consumption,
        0
      );
      user.consumption.weeklyConsumption.push({
        week: `Week ${user.consumption.weeklyConsumption.length + 1}`,
        consumption: weekTotal,
      });
      user.consumption.dailyConsumption = [];
    }

    const currentMonth = new Date().toLocaleString("en-US", { month: "short" });
    if (user.consumption.weeklyConsumption.length === 4) {
      const monthTotal = user.consumption.weeklyConsumption.reduce(
        (total, record) => total + record.consumption,
        0
      );
      user.consumption.monthlyConsumption = user.consumption.monthlyConsumption.filter(
        (record) => record.month !== currentMonth
      );
      user.consumption.monthlyConsumption.push({
        month: currentMonth,
        consumption: monthTotal,
      });
      user.consumption.weeklyConsumption = [];
    }

    const currentYear = new Date().getFullYear();
    if (user.consumption.monthlyConsumption.length === 12) {
      const yearTotal = user.consumption.monthlyConsumption.reduce(
        (total, record) => total + record.consumption,
        0
      );
      user.consumption.yearlyConsumption.push({
        year: currentYear,
        consumption: yearTotal,
      });
      user.consumption.monthlyConsumption = [];
    }

    await user.save();

    res
      .status(200)
      .send({ message: "Hourly consumption data saved and aggregated successfully" });
  } catch (error) {
    console.error("Error storing hourly consumption data:", error.message);
    res.status(500).send("Internal Server Error: Failed to store hourly consumption data.");
  }
});
router.get("/:userId/consumption", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Extract consumption data from the user object
    const consumptionData = {
      day: user.consumption.hourlyConsumption.map(({ hour, consumption }) => ({ hour, consumption })),
      week: user.consumption.dailyConsumption.map(({ day, consumption }) => ({ day, consumption })),
      month: user.consumption.monthlyConsumption.map(({ month, consumption }) => ({ month, consumption })),
      year: user.consumption.yearlyConsumption.map(({ year, consumption }) => ({ year, consumption }))
    };

    res.status(200).json(consumptionData);
  } catch (error) {
    console.error("Error fetching consumption data:", error.message);
    res.status(500).send("Internal Server Error: Failed to fetch consumption data.");
  }
});
router.post("/:userId/savePackageDataFromAI", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId, "-_id name months kind").exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const monthsData = { ...user.months, kind: user.kind };

    const apiUrl = "https://packages-api-6.onrender.com/predict";
    const response = await axios.post(apiUrl, monthsData);

    const packageData = response.data;

    // Assuming packageData is a single number returned from the AI model
    // Use findByIdAndUpdate to update the user's packages
    await User.findByIdAndUpdate(userId, { packages: packageData }, { new: true }).exec();

    res.status(200).json({ message: "Package data saved successfully", packages: packageData });
  } catch (error) {
    console.error("Error saving package data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/:userId/savePredictedConsumption", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get current date and time
    const now = new Date();
    const currentDateTime = now.toISOString().replace('T', ' ').substring(0, 19); // Format: YYYY-MM-DD HH:MM:SS

    // Fetch current weather
    const currentWeather = await getCurrentWeather();

    // Prepare data for the API
    const dataForModel = {
      datetime: currentDateTime,
      weather: `${currentWeather.temp} °C`,
    };

    // Send data to AI model for prediction
    const apiUrl = "https://consumption-api-1.onrender.com/predict/";
    const response = await axios.post(apiUrl, dataForModel);

    if (response.status !== 200) {
      console.error(`Error saving predicted consumption data: ${response.statusText}`);
      return res.status(500).json({ message: "Internal server error" });
    }

    const responseData = response.data;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the new predicted consumption entries
    const newPredictedConsumptions = responseData.map(item => ({
      datetime: new Date(item.datetime),
      predicted_consumption: item.predicted_consumption // Correct field name
    }));

    // Append the new predicted consumption entries to the existing array
    user.predicted_consumptions.push(...newPredictedConsumptions); // Correct field name and syntax

    // Save the user data
    await user.save();

    res.status(200).json({ message: "Predicted consumption saved successfully", predicted_consumptions: newPredictedConsumptions });
  } catch (error) {
    if (error.response) {
      console.error(`Error saving predicted consumption data: ${error.response.statusText}`);
    } else if (error.request) {
      console.error("Error saving predicted consumption data: No response received");
    } else {
      console.error("Error saving predicted consumption data:", error.message);
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Function to fetch current weather
async function getCurrentWeather() {
  try {
    const apiKey = '338be39345079a73b61813ef35d63a4e'; // Replace with your actual API key
    const city = 'Egypt'; // Replace with your city name

    // Make a GET request to the OpenWeatherMap API
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);

    // Extract the temperature data from the response
    const temperature = response.data.main.temp;

    return { temp: temperature };
  } catch (error) {
    console.error('Error fetching current weather:', error.message);
    throw new Error('Failed to fetch current weather');
  }
}
router.get("/:userId/getPredictedConsumptions", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the predicted_consumptions array
    const predictedConsumptions = user.predicted_consumptions.map(item => ({
      datetime: item.datetime,
      predicted_consumption: item.predicted_consumption
    }));

    res.status(200).json(predictedConsumptions);
  } catch (error) {
    console.error("Error fetching predicted consumption data:", error.message);
    res.status(500).json({ message: "Internal server error" });
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



