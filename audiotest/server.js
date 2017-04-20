const express = require('express'); //Express JS Webframework
const app = express(); //Create the backend application


app.use("/", express.static(__dirname));
app.listen(3000, function() {
    console.log('listening on port 3000');
});

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});
