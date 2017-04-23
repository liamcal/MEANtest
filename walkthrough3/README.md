# Mean Stack Walkthrough 3
*Liam Callaway*

For internal project use only. Inspired heavily by: https://zellwk.com/blog/crud-express-mongodb/

## Setup

In the previous walkthrough, we added front-end AngularJS code to dynamically display data. As before, this walkthrough assumes you have already completed the steps from the previous walkthrough.

You may like to keep working on your current project, or else make a duplicate to preserve the original.

## Installing and setting up MongoDB (and mongoose)

I'm going to assume you have mongodb installed correctly on your machine. (This is/will be covered in walkthrough0). You'll also need to have an instance of mongodb running on your local machine. Open up another terminal window and type:

` $ mongod `

As before, we'll need to add mongodb as a dependency to our project. Back in your main terminal window, type:

` $ npm install mongodb --save`

We'll also be using mongoose as our ORM wrapper to mongodb

` $ npm install mongoose --save`

Now let's import them into our `server.js` file. Add the following lines (before you create the Express app):

```js
const mongoDB = require('mongodb');
const mongoose = require('mongoose');
```

If mongodb has been setup properly, it should be running on your local machine on port 27017. To connect to it, first we'll need to specify the url, before using mongoose to open the connection.

```js
const mongoURL = 'mongodb://localhost:27017/walkthrough_db';
mongoose.connect(mongoURL);
```

One thing interesting here is that we never actually created the database `walkthrough_db`. MongoDB is smart, and will automatically create this db for us if it doesn't exist when we first try and connect.

## Creating a DB model

So have connected to the database but have no way to interact with it. To do this, we're going to use mongoose to create object models (which are based off a schema). You can think of a model as a representation of a specific object, which will be stored in it's own "table" equivalent in MongoDB. So in our case, we need a model for our birds which we want to store.

First, create a new directory called `models` in the root directory, and then add a new file called `bird.js` inside the directory.

Inside that file, we're going to need to import mongoose once more, and then use the `mongoose.Schema()` function to specify the structure of our model.

```js
//birds.js
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var birdSchema = new Schema({
    name: String,
    species: String
});
```

This specifies that each bird contains both a name and species, both as Strings.

Next we need to use mongoose to create and export the model which utilises this schema.

```js
var birdModel = mongoose.model('Bird', birdSchema);
module.exports = birdModel;
```

Now we have a model named `Bird`, which we can use to create `Bird` objects.

The last line is important. Without that, our model won't be exposed to any external files.

One last thing before we move on. We need to make sure this file is loaded in to the server. Add the following line to `server.js` along with the other import statements.
```js
const Bird = require('./models/bird');
```

## Creating a server-side API

We're going to create a bunch of request handlers on the server to control our database operations. These handlers will respond to requests made from the front-end, allowing us to eventually allow the user to interact with the DB from the front-end.

### GET - Find
First we'll register a handler to retrieve all the entries in the database. To do this we'll use a GET request (because we are GETting data).

```js
app.get('/birdAPI', function (req, res) {
    //Respond to GET requests at /birdAPI
});
```

Now let's add some code to the body of this handler. To query the DB, we use the mongoose `find()` on the model we've created. Because we want all the data, we don't need to specify any conditions. We do however need to provide a function which will be called once the query is finished.

```js
app.get('/birdAPI', function (req, res) {
    Bird.find(function(error, results) {
        if (error)
            res.send(err);
        else
            res.json(results);
    });
});
```

The inner function will be called automatically by mongoose once the query is completed. If there is an error, it will be specified in the `error` parameter. Otherwise the results of the query will be provided in the `results` parameter.

As mongoDB will return a JSON object containing the query results, we can directly send that JSON back to the front-end using `res.json()`.

Now let's add our next few API handlers

### POST - Create
If we want to add a new entry to the DB, we should use a POST request instead. We can use the same URL for our POST handler as we used for the GET handler, as the request type is different. To specify how to respond to a POST request, we use the following syntax:

```js
app.post('/birdAPI', function(req, res) {
    //Respond to the request.
});
```

We're going to assume for the moment that the body of the request will contain the JSON needed to create a new bird. We can access this JSON using `req.body`. If you want to examine what this looks like, you can use a `console.log()`. We'll then use the mongoose `create()` method to create a new bird and add into the db.

```js
app.post('/birdAPI', function(req, res) {
    var birdDetails = req.body;
    //console.log(birdDetails);
    Bird.create(birdDetails, function(err, result) {
        if (err)
            res.send(err);
        else
            res.json(result);
    });
});
```

We pass the JSON from the request directly into the create method, and mongoose does the rest. It then calls the function we provided.

There's one problem with this method as it is. The query result we get back from the `create()` method isn't very useful for us to send back. It would be more useful if this request handler returned the updated list of birds, including our newly added bird. So let's add in another `find()` call like we did before.

*You might like to try it yourself before checking how I did it below.*


```js
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
```

### DELETE - Remove

We can use a HTTP DELETE request to remove a bird from the database. There's a few ways we could specify which bird to delete. MongoDB automatically assigned each new database document (item) a unique identify using the `_id` field. So we should be able to use that to find the specific bird to delete.

But how do we go about specifying that in as part of the DELETE request. We could try and use the request body again, but that seems like overkill for just the id. Instead, let's make use of URL parameters like we did in the first walkthrough. We'll specify the ID to delete as put of the URL as follows:

```js
app.delete('/birdAPI/:bird_id', function(req, res) {
    var idToDelete = req.params.bird_id;
    //console.log(idToDelete);
    //Delete the bird
});
```

Now that we have the ID of the bird to delete, we can use it to remove the bird from the database that matched that ID. Because this is such a common thing to do, mongoose actually provides a handy  `findByIdAndRemove()` method which wraps a whole bunch of functionality together. As with the POST request, we're going to want to then query the DB again for the new list of birds and return that instead of the results from the DELETE request. We do this as follows:


```js
app.delete('/birdAPI/:bird_id', function(req, res) {
    var idToDelete = req.params.bird_id;
    //console.log(idToDelete);
    Bird.findByIdAndRemove(idToDelete, function(err, removeResults) {
        if (err)
            res.send(err)
        else {
            Bird.find(function(err, findResults) {
                if (err)
                    res.send(err)
                else
                    res.json(findResults);
            });
        }
    });
});
```

With that, our basic API is finished. Now it's time to update the front-end to make use of the API.

## Making HTTP requests from AngularJS

Our server-side API is setup to listen for HTTP requests on `/birdAPI`. So now we need to tell AngularJS to make these requests from the front-end.

The first change we need to make is to update out bird controller by *injecting* the `$http`. These is similar to the concept of including or importing external code. Edit the line were we declare the BirdsController in `app.js` to be as follows:

```js
app.controller('BirdsController', ['$scope', '$http', function($scope, $http) {
    //Controller functionality
}]);
```

### Using the GET API
Now, let's make it so that our app retrieves the list of birds when the page is loaded. Remove the 3 birds we had previously placed in the controller's list of birds, and replace it with an empty array. Then, let's make a GET request to the API.

```js
app.controller('BirdsController', ['$scope', '$http', function($scope, $http) {

    $scope.birds = [];

    $http.get('/birdAPI').then(function (res) {
        $scope.birds = res.data;
    }, function(err) {
        console.log("Error: " + err)
    });

    //Rest of the controller functionality
}]);
```
We're using the `.then()` syntax to specify what should happen when the request is completed. `then()` takes two functions as a parameter, which specify what should happen if the request is successful or fails.

You should notice that all we need to do to update the list of birds is set to be equal to `res.data`. Because the server is sending back the JSON from the DB, this is already in the format that our front-end is expecting.

Now we have a way to retrieve the data, but this is useless as our database is currently empty. Next we need a way to get some birds in there.

### Using the POST API

We already have a `addBird()` function as part of our controller. Lets modify that so that instead of simply adding the form data to the list, we instead send it off to the DB via the API.

```js
$scope.addBird = function() {
    var newBird = $scope.formData;
    $http.post('/birdAPI', newBird).then(function (res) {
        $scope.formData = {};
        $scope.birds = res.data;
    }, function (err){
        console.log('Error: ' + err);
    });
}
```

This should be pretty familiar to us now. We make the POST request in a similar manner to our previous GET request, except we now pass the formData along with the request. We then clear the formData as before, and update the bird list using `res.data` again (remember we made it so that our `create()` query performs a `find()` operation once it's done to get and return the updated list).

### Using the DELETE API

The last API call we need to implement is the DELETE request. As before, we already have a method for deleting a bird. So let's update that to use the API instead.

```js
$scope.deleteBird = function(id) {
    $http.delete('/birdAPI/' + id).then(function (res) {
        $scope.birds = res.data;
    }, function(err) {
        console.log('Error: ' + err);
    });
};
```

Previously our function took the birds name as the identifier to be used to delete the bird. Now we have the MongoDB ObjectId as a unique identifier, we'll use that instead. All we need to do to concatenate the id onto the URL, and the API will do the rest.

Again, the rest of this code should look pretty familiar by now.

Next, we just need to update our HTML so when we call the delete method, we pass the `_id` and not the `name`.

```html
<div ng-repeat="bird in birds">
    <span>
        <p><button type="submit" ng-click="deleteBird(bird._id)">Remove</button>  {{ bird.name }}: {{ bird.species }}</p>
    </span>
</div>
```

All that's been changed here is the parameter to the delete method.
Now let's try it out.

## Testing

Run the server using `$ npm run dev` as usual (make sure you have `$ mongod` running beforehand or the app will crash).

Navigate to page and attempt to add a bird.

Unfortunately, things don't seem to work properly... When we add a bird, we just get a blank entry.

Let's try debugging by adding a log statement into the front-end `addBird()` method.
```js
$scope.addBird = function() {
    var newBird = $scope.formData;
    console.log(newBird);
    //rest of add method
}
```
Refresh the page, open your browser's console and attempt to add a bird. Here it seems like the newBird data is being retrieved correctly. It's just not being processed properly on the server.

This is because, as great as Express is, it doesn't know how to parse this incoming JSON straight out of the box. Luckily, there's a library for that!

### Installing body-parser

The body-parser package will allow us to parse JSON (along with a bunch of other data formats) with ease. Install it using npm as follows

` $ npm install body-parser --save `

Then import it into `server.js` (before we create the Express app)

```js
const bodyParser = require('body-parser');
```

Finally, specify that we want to use body-parser to parse JSON (after the Express app has been created).

```js
app.use(bodyParser.json());
```

And that's all we need to do. bodyParser will automatically take care of handling the JSON passed from the front-end for us.

## Testing (cont.)

Now go back and reload the page. Hopefully everything should be working now. We can add and delete new birds as necessary, and the list should be dynamically updated.

It's possible you might have some invalid DB entries from before. The delete button should still work on these. Regardless it would be good to have a tool to view and interact directly with the DB (similar to phpMyAdmin). We can actually do this via the command-line with mongo, but a GUI tool is much easier.

My recommendation is RoboMongo. You can download it here: https://robomongo.org/download

As long as you have `mongod` running, it should automatically be able to find and connect to the local DB. You can go in and view the current database entries in the birds collection of `walkthrough_db`. From here you can directly add, edit or delete entries. Try making some changes via the website and then viewing them in RoboMongo, and vice versa.

## Conclusion

We've covered a lot in this walkthrough. I'd suggest taking some time to go through all the code we have so far and make sure you're familiar with what it does and how it all ties together. Considering the amount of functionality we've achieved, I think you'll actually find the code required is a lot lower than what you might be used to. It should certainly be a cleaner and easier to read than the PHP equivalent.

A possible extension to this walkthrough is adding another text field which allows us to search/filter the results. This will require a slight tweak to the GET portion of the API, and a simple regex, but otherwise there's no new concept.

Currently our "Enlarge Birds" button still only makes changes client-side. To make this update all the entries in the database isn't super easy, but feel free to give it a go. You'll probably need to register a new API handler, as our current set aren't equipped to handle updates very well. (I haven't done this myself yet).

I'm not sure if I'll do any more walkthroughs. I think we've covered the basics now. It's possible I might do one more on project file structure and best practices code organisation (but I'm still wrapping my head around that myself.)

I'd strongly encourage people to do further research on the technologies/packages I've discussed if you have time. Also it would probably be quite valuable to play around with extending our little demo in some ways and see if you can add some new features.
