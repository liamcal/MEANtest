const express = require('express');
const bodyParser = require('body-parser');

const mongoDB = require('mongodb');
const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/walkthrough_db';
mongoose.connect(mongoURL);

const Bird = require('./models/bird');

const app = express();

app.use(bodyParser.json());

app.use("/", express.static(__dirname));

app.listen(3000, function() {
  console.log('Server started on port 3000')
});

// app.get('/', function(req, res) {
//   res.send('Welcome to Birdsong!')
// });

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get('/birds', function(req, res) {
    res.sendFile(__dirname + '/birds.html')
});

app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/register.html')
});

app.get('/users/:user_name', function(req, res) {
    var name = req.params.user_name;
    res.send("Hello, " + name + "!");
});

app.get('/birdAPI', function (req, res) {
    Bird.find(function(error, results) {
        if (error)
            res.send(err)
        else
            res.json(results);
    });
});

app.post('/birdAPI', function(req, res) {
    var birdDetails = req.body;
    //console.log(birdDetails);
    Bird.create(birdDetails, function(err, createResults) {
        if (err)
            res.send(err);
        else {
            Bird.find(function(err, findResults) {
                if (err)
                    res.send(err);
                else
                    res.json(findResults);
            });
        }
    });
});

app.delete('/birdAPI/:bird_id', function(req, res) {
    var idToDelete = req.params.bird_id;
    Bird.findByIdAndRemove(idToDelete, function(err, removeResults) {
        if (err)
            res.send(err);
        else {
            Bird.find(function(err, findResults) {
                if (err)
                    res.send(err);
                else
                    res.json(findResults);
            });
        }
    });
});
