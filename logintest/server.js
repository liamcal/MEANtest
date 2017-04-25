/* Import Express JS Webframework and required middleware */
const express = require('express');
const bodyParser = require('body-parser');
const config = require("./config/main.js");
/* Import mongoDB and mongoose */
const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/birdsong_db'; //The location of the database (Will create if doesn't exist)
const passport = require('passport');
const path = require('path');

/* Create the backend application */
const app = express();

/* Setup Bodyparser to be able to parse url and application json */
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());

/* Set location of static resources */
app.use("/", express.static(__dirname));

app.use(passport.initialize());

/* Connect to the DB */
mongoose.connect(mongoURL);


/* Begin listening for HTTP requests on port 3000 */
app.listen(3000, function() {
    console.log('listening on port 3000');
});


/* Serve the homepage HTML at root page */
app.get('/', function (req, res) {
    res.sendFile('/index.html');
});


const router = require('./router');

router(app);
