# Mean Stack Walkthrough 2
*Liam Callaway*

For internal project use only. Inspired heavily by: https://zellwk.com/blog/crud-express-mongodb/ and https://expressjs.com/en/guide/routing.html
## Setup

In the previous walkthrough, we created a simple web server using node and Express. This walkthrough assumes you have already completed the steps from the previous walkthrough, and will continue building on it.

You may like to keep working on your current project, or else make a duplicate to preserve the original.

## Installing Angular

There's a lot we can do just with Node and Express, but if we want to directly manipulate what is being seen by the user, we're better off using AngularJS.

To do so, first we'll need to add angular to the project. Remember the syntax is

`$ npm install angular --save`

This will add the angular files into our project, but we need to make sure that it's actually loaded into the browser. To do this, we'll need to add a script tag into the head tag of our `index.html` page.

```html
<head>
    ...
    <script type = "text/javascript" src="node_modules/angular/angular.js"></script>
</head>
```

Now we're good to go with Angular.

## Creating the Angular app

We'll need a new file to start specifying our front-end AngularJS. So let's create a file called `app.js`. Inside the file, place the following code:

```js
var app = angular.module('birds', []);
```
Angular uses the concepts of modules, which are used to group functionality. For now, we will store all our front-end logic in a single module called `'birds'`. The empty array `[]` is something more complicated that we don't need to worry about now.

*Waves hand of Angular Magic...*

So we have our `app.js` file, but we need to make sure it is being loaded alongside the HTML. To do that, we'll need to add another script tag.

```html
<script type = "text/javascript" src = "app.js"></script>
```

There's one more thing we need to do here. By default, our Express app doesn't know where to look for static resources such as our front-end javascript files. As a result, we'll get 404 errors when we try and load these files. To fix this, add the following line into the `server.js` file before we start listening for requests.

```js
app.use("/", express.static(__dirname));
```

This will tell Express that our static resources are located in the root directory.

Now we should specify in the HTML that we will be using the `'birds'` module. To do this, modify the HTML tag as follows:

```html
<html lang="en" ng-app="birds">
```

Note that any HTML property that starts with `ng-` is an Angular directive.

## Creating an Angular Controller

We've set up our Angular front-end, but we haven't added any functionality yet. To do this, we're going to use something called a controller.

Angular controller's are kind of like classes. They contain objects and methods, and are attached to a block of HTML. A single module can contain a number of classes.

We're going to create a controller to keep track of a list of birds to display on the home page. Add the following code to `app.js` to do so:

```js
app.controller('BirdsController', ['$scope', function($scope) {
    $scope.birds = [
        {name : "polly", species : "parrot"},
        {name : "bruce", species : "cockatoo"},
        {name : "sam", species : "toucan"}
    ];  
}]);
```

The syntax here has a lot to it. We're creating a new controller with the name `'BirdsController'`. The next parameter is a list, which contains the controller's dependencies, and a function to call. This function is where we specify the attributes and operations for the controller. You can think of `$scope` as the angular equivalent of the `this` keyword.

Currently, all we've done in the function is defined a list of birds as part of our controller. Note that each bird is a javascript object, containing a name and species field.

## Using a controller

Now that we have some data in our controller, let's display it as part of the HTML. First we need to attach a controller to some block oh HTML (similar to how we attached the module to the whole page). For the moment, we're going to apply the controller to the main page content, so let's put it on the body element. To attach a controller, we use the `ng-controller` attribute as follows:

```html
<body ng-controller="BirdsController">
```

Now let's display our birds on the page. To access controller elements from inside the HTML, we use `{{ }}` notation. Let's display the list of birds in a paragraph tag
```html
<p>{{ birds }}</p>
```
This will display the contents of `$scope.birds` from the controller. If we open the page into the browser, we'll see the list of objects being displayed in the raw object notation. This isn't very user friendly. It would be better if we could loop through the list of objects, and display each property individually. Angular let's us to do a `foreach` style loop with the `ng-repeat` directive. Add the following HTML into the body of `index.html`

```html
<div>
    <div ng-repeat="bird in birds">
        <p>{{ bird.name }}: {{ bird.species }}</p>
    </div>
</div>
```

Now, angular will duplicate the p tag for each item in the list. We can access the current list item using `bird`, and we can then use `.` notation to access the properties of that item. Now when we load up the page, we shall see a slightly nicer list of birds drawn from the controller.

The `{{ }}` notation can be used to access any attributes from the controller. So if we wanted to see how many birds were currently in the list, we could do so as follows:

```html
<p>Number of birds: {{ birds.length }}</p>
```

## Controller methods

We'd like to be able to manipulate the data dynamically from the front-end as well. To do this, we should add some methods to the controller. We'll start with a simple (and slightly contrived) example. Add the following code inside the `BirdsController` function:

```js
$scope.makeBig = function() {
    for (var i = 0; i < $scope.birds.length; i++) {
        $scope.birds[i].name = $scope.birds[i].name.toUpperCase();
    }
}
```

This function converts each of the names of the birds to upper-case.

Next we need a way to trigger this method. We'll use a button, along with the `ng-click` directive. Let's add this button to our HTML like so:

```html
<button ng-click="makeBig()">Enlarge Birds!</button>
```

Now when the button is clicked, out controller method is called and all the birds' names will be converted to upper-case.

## Text Input

Our next step is to be able to process more detailed information provided by the user. A common way to do this is with HTML forms. Firstly, let's add some extra functionality to our controller in `app.js`.

```js
    $scope.formData = {};
    $scope.addBird = function() {
        $scope.birds.push($scope.formData);
        $scope.formData = {}
    };
```

Here we have an object, which we will use to hold the current information provided in the form, and a function which pushes that data into the birds array, before clearing the object to start over;

Now let's create the form to make use of this new controller functionality.

```html
<form>
    <input type="text" placeholder="name" name="name" ng-model = "formData.name">
    <input type="text" placeholder="species" name="species" ng-model = "formData.species">
    <button type="submit" ng-click = "addBird()">Submit</button>
</form>
```

You should be able to spot the button with `ng-click` to call the addBird function like before. The new and super-useful thing here is the use of the `ng-model` directive. This allows us to specify a two-way binding between the contents of each field, and a property of the `formData` object. As the user types into either of these fields, `formData` is automatically updated to match the contents of the field. That's all there is to it! You should be able to go to page and add some new birds to the list.

## Challenge and Conclusion

Try and add the ability to remove birds from the list. To do this, create a delete function in the controller which will take the name of a bird as a parameter, and remove all birds with that name from the list. Add a delete button alongside the p tag inside the `ng-repeat`, which triggers the new delete method using the name of the current bird. If you want to see how I completed this, check the source code that came with this walkthrough on GitHub.

*Hint: It's probably easier to create a new list containing all the birds that need to remain and then set it to be displayed rather than try and remove directly from the existing list*

Another thing you'll notice is that none of our changes are persistent. Every time we refresh the page, the list reverts back to the original three birds. This is because our javascript get's reloaded and the contents of the birds list goes back to its initial state.

To keep our changes persistent, we're going to need a database, which I'll cover in the next walkthrough.
