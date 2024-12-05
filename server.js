const express = require('express');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue, set, update, get } = require('firebase/database');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parse HTTP request body

// Firebase configuration
const config = {
  apiKey: "AIzaSyBtJ0SPvY312ufL8mBUwSOB5ZKiXi1FkkQ",
  authDomain: "soa1-442406.firebaseapp.com",
  databaseURL: "https://soa1-442406-default-rtdb.firebaseio.com",
  projectId: "soa1-442406",
  storageBucket: "soa1-442406.firebasestorage.app",
  messagingSenderId: "165245419983",
  appId: "1:165245419983:web:53ac8479df68de05dc92ba",
  measurementId: "G-7ZZYHHTV1H"
};

// Initialize Firebase
const firebaseApp = initializeApp(config);
const database = getDatabase(firebaseApp);

app.get('/', async (req, res) => {
  console.log("HTTP GET Request");

  const userReference = ref(database, '/Users/');
  try {
    const snapshot = await get(userReference);
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log("Fetched data:", data);
      res.json(data); // Send response once
    } else {
      console.log("No data available");
      res.status(404).send("No users found.");
    }
  } catch (error) {
    console.error("The read failed:", error.message);
    res.status(500).send("The read failed: " + error.message);
  }
});

// Create new instance
app.put('/', (req, res) => {
  console.log("HTTP PUT Request");

  const { UserName, Name, Age } = req.body;

  if (!UserName || !Name || !Age) {
    console.error("Invalid PUT request data.");
    return res.status(400).send("Invalid input: Missing UserName, Name, or Age.");
  }

  const referencePath = `/Users/${UserName}/`;
  const userReference = ref(database, referencePath);

  set(userReference, { Name, Age })
    .then(() => {
      console.log("Data saved successfully.");
      res.status(200).send("Data saved successfully.");
    })
    .catch((error) => {
      console.error("Error writing to Firebase:", error.message);
      res.status(500).send("Error saving data to Firebase: " + error.message);
    });
});

// Update existing instance
app.post('/', (req, res) => {
  console.log("HTTP POST Request");

  const { UserName, Name, Age } = req.body;

  if (!UserName || (!Name && !Age)) {
    console.error("Invalid POST request data.");
    return res.status(400).send("Invalid input: Missing UserName or fields to update.");
  }

  const referencePath = `/Users/${UserName}/`;
  const userReference = ref(database, referencePath);

  update(userReference, { ...(Name && { Name }), ...(Age && { Age }) })
    .then(() => {
      console.log("Data updated successfully.");
      res.status(200).send("Data updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating Firebase:", error.message);
      res.status(500).send("Error updating data in Firebase: " + error.message);
    });
});

// Delete an instance
app.delete('/', (req, res) => {
  console.log("HTTP DELETE Request");
  res.status(501).send("DELETE functionality not implemented yet.");
});

// Start the server
const server = app.listen(8080, '0.0.0.0', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
