
const express = require("express");
const axios = require("axios");
const router = express.Router();
const Package = require("../models/package.model");
const User = require("../models/UserModel");

// Get all packages
router.post('/', async (req, res) => {
  const userEmail = req.body.email;

  try {
    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new Package instance
    const newPackage = new Package({
      userId: user._id,
      email: userEmail,
      package:123,
    });

    // Save the newPackage
    await newPackage.save();

    // Update the user's packages array with the newPackage _id
    user.packages.push(newPackage._id);

    // Save the updated user
    await user.save();

    return res.status(201).json(newPackage);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
/*
  const package = new Package({
    userId: user._id,
    email: req.body.email,
    package: req.body.package,
  });

  try {
    const newPackage = await package.save();
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }


  router.post('/', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    // Data to be sent to the external AI API
    const data = {
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

    // Make a POST request to the external AI API with data in the request body
    const response = await axios.post('https://api-model-2.onrender.com/predict', data);

    if (response.status !== 200) {
      console.log(response.data); // Log the detailed error information
      return res.status(400).json({ message: response.statusText });
    }

    // Extract relevant data from the API response
    const apiData = response.data;

    // Check if apiData has the expected structure
    if (typeof apiData !== 'object' || apiData.prediction === undefined) {
      return res.status(400).json({ message: 'API did not return the expected data structure' });
    }

    // Save the data received from the API in the 'package' field
    const newPackage = new Package({
      userId: user._id,
      email: req.body.email,
      package: apiData.prediction,
    });

    // Save the new Package document
    await newPackage.save();

    return res.status(200).json({ message: 'Success', data: newPackage });
  } catch (error) {
    if (error.response && error.response.status === 422) {
      // Handle validation errors
      const validationErrors = error.response.data.detail;
      console.error('Validation Errors:', validationErrors);
      // Additional handling logic here
      return res.status(422).json({ message: 'Validation Error', errors: validationErrors });
    } else {
      // Handle other types of errors
      console.error('Unexpected Error:', error.message);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
});*/

// Middleware to get a package by ID
async function getPackage(req, res, next) {
  let package;
  try {
    package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: "Cannot find package" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.package = package;
  next();
}
// Update a package
router.patch("/:id", getPackage, async (req, res) => {
  if (req.body.package != null) {
    res.package.package = req.body.package;
  }

  try {
    const updatedPackage = await res.package.save();
    res.json(updatedPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a package
router.delete("/:id", getPackage, async (req, res) => {
  try {
    await res.package.remove();
    res.json({ message: "Deleted package" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a package by ID
async function getPackage(req, res, next) {
  let package;
  try {
    package = await Package.findById(req.params.id);
    if (package == null) {
      return res.status(404).json({ message: "Cannot find package" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.package = package;
  next();
}

module.exports = router;


/*const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/UserModel');
const Package = require('../models/PackageModel');

router.get('/:userId/packages', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const response = await axios.get('https://aa00-34-106-176-217.ngrok-free.app/packages_prediction');
    const responseData = response.data;

    const package = new Package({
      user: user._id,
      package: responseData.package
      // set other fields as needed
    });

    await package.save();

    const savedPackage = await Package.findById(package._id)
      .populate('user')
      .exec();

    res.status(200).send(savedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from API');
  }
});

// POST endpoint to send user data to the API
router.post('/:userId/packages', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const data = {
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

    const response = await axios.post('https://aa00-34-106-176-217.ngrok-free.app/packages_prediction', data);
    const responseData = response.data;

    console.log('Data sent to API!');

    res.status(200).send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending data to API');
  }
});

module.exports = router;
*/

/*const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/UserModel');
const Package = require('../models/PackageModel');

router.get('/:userId/packages', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const response = await axios.get('https://aa00-34-106-176-217.ngrok-free.app/packages_prediction');
    const responseData = response.data;

    const package = new Package({
      user: user._id,
      package: responseData.package
      // set other fields as needed
    });

    await package.save();
    //user.packages.push(Package._id);
//await user.save();
//res.status(201).send(Package);


    console.log('Document saved!');

    const savedPackage = await Package.findById(package._id)
      .populate('user')
      .exec();

    console.log('User fetched!');

    res.status(200).send(savedPackage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from API');
  }
});

// POST endpoint to send user data to the API
router.post('/:userId/packages', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const data = {
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

    const response = await axios.post('https://aa00-34-106-176-217.ngrok-free.app/packages_prediction', data);
    const responseData = response.data;

    console.log('Data sent to API!');

    res.status(200).send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending data to API');
  }
});

module.exports = router;
*/
/*const express = require('express');
const router = express.Router();
const axios = require('axios');
const Package = require('../models/PackageModel');

router.get('/', (req, res) => {
  axios.get('https://aa00-34-106-176-217.ngrok-free.app/packages_prediction')
    .then(response => {
      const data = response.data;
      const package = new Package({
        user: data.userId,
        package: data.package
        // set other fields as needed
      });
      package.save((error) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error saving document');
        } else {
          console.log('Document saved!');
          Package.findById(package._id)
            .populate('user')
            .exec((error, package) => {
              if (error) {
                console.error(error);
                res.status(500).send('Error fetching data from database');
              } else {
                console.log('User fetched!');
                res.status(200).send(package);
              }
            });
        }
      });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Error fetching data from API');
    });
});

module.exports = router;
*/