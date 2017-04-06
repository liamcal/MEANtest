/* Create the angular frontend app */
var app = angular.module('birds', []);

/* Controller for Bird Information */
app.controller('BirdsController', ['$scope', '$http', function($scope, $http) {

    $scope.birds = [];      //Current list of birds to display
    $scope.formData = {};   //Current form data for a new bird
    $scope.searchTerm = ""; //Current filter term from search box

    /* Initially load in the current birds using API*/
    $http.get('/birds').then(function (response) {
        $scope.birds = response.data;
    }, function(error) {
        console.log("Error: " + error)
    });


    /* Controller createBird() method to add a new bird */
    $scope.createBird = function() {
        /* Extract the data for the new bird */
        var newBird = $scope.formData;
        /* POST the data to API */
        $http.post('/birds', newBird)
        .then(function (response) {
            $scope.formData = {}; //Clear the form for a new entry
            $scope.birds = response.data; //Update the list of current birds
        }, function (error){
            console.log('Error: ' + error);
        });
    };


    /* Controller filter() method to search through the list of birds */
    $scope.filter = function() {
        /* Extract the search term */
        var search = $scope.searchTerm;
        /* GET the data from the API using filter parameter */
        $http.get('/birds', {params : {filter : search}})
        .then(function (response) {
            $scope.birds = response.data; //Update the list of current birds
        }, function (error) {
            console.log('Error: ' + error);
        });
    }


    /* Controller deleteBird(id) method to remove a bird from the list */
    $scope.deleteBird = function(id) {
        /* DELETE the data via the API using URL paramtere */
        $http.delete('/birds/' + id).then(function (response) {
            $scope.birds = response.data; //Update the list of current birds
        }, function(error) {
            console.log('Error: ' + data);
        });
    };

}]);
