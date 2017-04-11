var app = angular.module('birds', []);
app.controller('BirdsController', ['$scope', '$http', function($scope, $http) {

    $scope.birds = [];

    $http.get('/birdAPI').then(function (res) {
        $scope.birds = res.data;
    }, function(err) {
        console.log("Error: " + err)
    });


    $scope.makeBig = function() {
        for (var i = 0; i < $scope.birds.length; i++) {
            $scope.birds[i].name = $scope.birds[i].name.toUpperCase();
        }
    }

    $scope.formData = {};

    $scope.addBird = function() {
        var newBird = $scope.formData;
        // console.log(newBird);
        $http.post('/birdAPI', newBird) .then(function (response) {
            $scope.formData = {}; //Clear the form for a new entry
            $scope.birds = response.data; //Update the list of current birds
        }, function (error){
            console.log('Error: ' + error);
        });
    }

    $scope.deleteBird = function(id) {
        $http.delete('/birdAPI/' + id).then(function (res) {
            $scope.birds = res.data;
        }, function(err) {
            console.log('Error: ' + err);
        });
    };
}]);
