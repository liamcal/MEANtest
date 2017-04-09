# Mean Stack Walkthrough 1
Liam Callaway. For internal project use only. Inspired heavily by: https://zellwk.com/blog/crud-express-mongodb/ and https://expressjs.com/en/guide/routing.html
## Setup

Create a new node project:

`$ npm init`

You will be prompted for various information. You can specify some of the early ones but most are fine to just skip over. Once done, this will create a `package.json` file which is used for managing installed modules and dependencies.

The first module we require to install is Express, which will provide our Webserver Framework. To add express to the project:

`$ npm install express --save`

This will automatically download the module and add it to a dependency inside `package.json`.

## Creating the server
Next we're going to create our main server file. Create a file named `server.js` and then add the following code to it:

```js
const express = require('express');
const app = express();
```

This will load up Express and create a new Express app. Now we need to actually start the server on a port and begin listening for HTTP requests.

Add the following code to the file:

```js
app.listen(3000, function() {
  console.log('Server started on port 3000')
});
```

Now, let's run the server using the following terminal command:

` $ node server.js `

You should see the console message saying that the server is listening for requests. But we haven't specified how we should respond to any of these requests.

## Configure nodemon
Before we go any further, let's make it a bit easier to keep the server running. During development, we're going to be making a lot of changes to our server file. Each time we do this, we'll need to switch back and re-run the server. This will get tedious, but we can install a package called `nodemon` to manage keeping the server alive for us. Install the package as follows:

`$ npm install nodemon --save-dev`

This is similar to how we installed Express before. However, by adding the `-dev` flag, we specify that it is a dev dependency. This will be useful later on.

Now nodemon will be installed inside `./node_modules/.bin/`. So we can run the server with

`$ ./node_modules/.bin/nodemon server.js`

That filepath hasn't really made things any easier though. Instead, let's specify a startup script in our `package.json` file.

Edit the `"scripts"` key as follows
```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon server.js"
},
```

Now, we can run the server by triggering nodemon with

` $ npm run dev`


Now, back to our editing our server...

## Responding to Requests
When a browser navigates to a top level page, it is actually performing a GET request to the `'/'`. So let's specify how we should respond to that request, using the following code.

```js
app.get('/', function(req, res) {
  res.send('Welcome to Birdsong!')
});
```

Now, when the user navigates to our homepage, the Express framework will call the function we provided. `req` and `res` are short for request and response respectively. It is standard convention to use these terms.

*Aside - In some guides you may see the following notation using ES6 arrow functions. These are functionally equivalent, but we shall use the first option for readability.*

```js
app.get('/', (req, res) => {
  //do stuff
});
```

At last, we can view our page. Check that nodemon install running the server, and then navigate to localhost:3000 in your browser. You should see our welcome message.

## Serving HTML
Rather than sending out a plaintext response, we should actually send out some HTML. We could type it as a string inside the function, but a much better choice would be to save an external HTML file and then send that.

So, create an `index.html` file in the same directory, and copy in the following HTML boilerplate.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BirdSong</title>
</head>
<body>
  <p>Welcome to Birdsong!</p>
</body>
</html>
```

Now let's modify the response, so we send the file instead:

```js
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});
```

Notice that we are now using `senfile()` instead of `send()`. Also, we have used `__dirname` to specify the current working directory, as paths must be absolute by default.

If we open up `localhost:3000` in our browser again, we should now see our proper HTML page. You can also check the HTML contents by right-clicking and selecting 'view-source'.

Now try creating some other simple HTML pages (eg. `birds.html`, `register.html`, etc.), and add additional request handlers in `server.js` to register these pages and serve the appropriate HTML file. Check that you can navigate to the new pages via URLs (eg. `localhost:3000/birds`)

## URL Parameters

We can add some extra functionality in our URL schemes. Firstly, we can use some basic Regular Expression (regex) syntax to specify character multiplicities.

- `?`: 0-1
- `+`: 1-many
- `*`: 0-many

This means we can register URL's like this:

```js
app.get('/birds?', function (req, res) {
    //will match either /bird or /birds
});

app.get('/bi+rds', function (req, res) {
    //will match /birds, /biirds, /biiiirds, /biiiiiiiirds etc
});
```

Another (potentially more useful) feature we can use involves URL parameters. By specifying a `:` as part of a route, we indicate that it is a named parameter. That parameter will then act as a wildcard in the URL, and we can retrieve the value passed from the request object.

Add the following code to the server file.

```js
app.get('/users/:user_name', function(req, res) {
    var name = req.params.user_name;
    res.send("Hello, " + name + "!");
});
```

Now, when a user navigates to `localhost:3000/users/foobar`, they will see `Hello, foobar!`, and `localhost:3000/users/liam`, will display `Hello, liam!`.

You'll notice we've reverted back to sending plaintext instead of a HTML file. It would be good if we could somehow inject our parameter into the HTML. There's a few ways we could do this, but in our case this is where the AngularJS front-end is going to come in later on.
