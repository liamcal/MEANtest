const express = require('express'); //Express JS Webframework
const bodyParser = require('body-parser');  //

const mongoDB = require('mongodb');
const mongoose = require('mongoose');
const mongoURL = 'mongodb://localhost:27017/birdsong_db';

const Bird = require('./models/bird');

const app = express(); //Create the backend application

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


app.post('/birds', function(req, res) {
    console.log("New bird POST received");
    console.log(req.body);
    Bird.create(req.body).exec(function(err, birds) {
        if (err)
            res.send(err)

        console.log('saved to db');
        Bird.find(function(err, birds) {
            if (err)
                res.send(err)
            res.json(birds);
        });
    });
});


app.delete('/birds/:bird_id', function(req, res) {
    console.log("Deleting a bird");
    Bird.remove().where({ _id : req.params.bird_id}).exec(function(err, todo) {
        if (err)
            res.send(err)
        console.log('saved to db');
        Bird.find(function(err, birds) {
            if (err)
                res.send(err)
            res.json(birds);
        });
    });
});
