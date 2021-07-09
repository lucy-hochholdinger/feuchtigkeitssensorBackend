// All requirements
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '..', '.env')})
const axios = require('axios')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mqtt = require('mqtt')
const cors = require('cors');
const mongoose = require('mongoose');
const WaterData = require('./models/WaterData.js');
const User = require('./models/User.js');

// Password encryption level
const saltRounds = 10;

// MONGO DB
// URI on which you can find the database and how to connect
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_URL}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
console.log(mongoUrl);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('db connected')).catch((err) => console.error(err));

// MQTT
const mqttclient  = mqtt.connect('mqtt://mqtt.hfg.design')

mqttclient.on('connect', function () {
  mqttclient.subscribe('/sweavs/leonilucy/moisture', function (err) {
    if (!err) {
        console.log('mqttClient connection');
    }
  })
})
mqttclient.on('message', function (topic, message) {
// Message is Buffer
console.log(message.toString());
saveData(message);
})

function saveData(message) {
  let doc = JSON.parse(message);
  const newData = new WaterData(doc);
  newData.createdAt = new Date();
  newData.save();
}

//EXPRESS:
// Webserver for REST calls
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post('/api/getLastWeek', async (req, res) => {
  console.log("looking for last 8 values");
  let sentData = req.body.mac;
  console.log(sentData)
  // To get, sort and limit the sensor data
  WaterData.find({mac: sentData}).sort({'createdAt': -1}).limit(8).then((data) => {
      console.log(data);
      res.send(data);
  });
});

//REGISTRATION
app.post('/api/register', (req, res) => {
  console.log("registering new user");
  const newUser = new User({
      // Email address and username are saved 
      emailadress: req.body.emailadress,
      username: req.body.username,
      // Password is encrypted
      passwordHash: bcrypt.hashSync(req.body.password, saltRounds),
      // Time is set
      createdAt: Date.now(),
      });
      // New user will be saved
      newUser.save()
      .then((usr) => {
          // The user gets his own token each time
          // generates session token
          const token = jwt.sign({ userId: usr._id }, process.env.JWT_SECRET);
          res.status(200).json(
          {
              token,
              emailadress: usr.emailadress,
              username: usr.username,
          },
          );
      })
      .catch((err) => {
          console.log(err);
          res.status(400).send('account taken');
      });
})
//LOGIN
app.post('/api/login', (req, res) => {
  console.log("logging in user");
  // User data are searched and matched
  User.findOne({ username: req.body.username })
  .then((usr) => {
      if (!usr) {
      res.status(401).send('invalid credentials - err 1');
    // checks password validity
      } else if (bcrypt.compareSync(req.body.password, usr.passwordHash)) {
      // The user gets his own token each time
      // generates token
      const token = jwt.sign({ userId: usr._id }, process.env.JWT_SECRET);
      res.status(200).json(
          {
          token,
          emailadress: usr.emailadress,
          username: usr.username,
          },
      );
      } else {
      res.status(401).send('invalid credentials - err2');
      }
  })
  .catch((err) => {
      console.error(err);
      res.status(500).json({ title: 'server error', err });
  });
});

// This port is listened to
const port = 3000;
app.listen(port, () => {
  console.log(`water data service live @http://localhost:${port}`);
});
