/* Import Express JS Webframework and required middleware */
const express = require('express');
const bodyParser = require('body-parser');

/* Import mongoDB and mongoose */
const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/birdsong_db'; //The location of the database (Will create if doesn't exist)

/* Import our own Bird model */
const Bird = require('./models/bird');

/* Create the backend application */
const app = express();

/* Setup Bodyparser to be able to parse url and application json */
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());

/* Set location of static resources */
app.use("/", express.static(__dirname));

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

/* DB API HANDLERS */

/* Get requests, data needed from DB */
app.get('/birds', function (req, res) {
    /* Users may specify a get parameter to filter results */
    var filter = new RegExp(req.query.filter, "i")
    Bird.find().or([ {name : filter}, {bird : filter} ]).exec(function(err, results) {
        if (err)
            res.send(err)
        /* Send back the results */
        res.json(results);
    });
});

/* Post request, used to add new birds to DB */
app.post('/birds', function(req, res) {
    var birdDetails = req.body;
    /* Create a new Bird object and add to DB */
    Bird.create(birdDetails, function(err, birds) {
        if (err)
            res.send(err)
        /* Retrieve the updated list of birds and send as response */
        Bird.find(function(err, birds) {
            if (err)
                res.send(err)
            res.json(birds);
        });
    });
});


/* Delete request, used to remove existing birds from DB */
app.delete('/birds/:bird_id', function(req, res) {
    var idToDelete = req.params.bird_id;
    /* Remove the bird with matching ID */
    Bird.remove().where({ _id : idToDelete}).exec(function(err, todo) {
        if (err)
            res.send(err)
        /* Retrieve the updated list of birds and send as response */
        Bird.find(function(err, birds) {
            if (err)
                res.send(err)
            res.json(birds);
        });
    });
});
