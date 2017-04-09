const express = require('express');
// const bodyParser = require('body-parser');

const app = express();

//app.use(bodyParser.json());

/* Set location of static resources */
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
