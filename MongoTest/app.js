
var app = angular.module('birds', []);

app.controller('BirdsController', ['$scope', '$http', function($scope, $http) {

    $scope.birds = [];
    $scope.formData = {};
    $scope.searchTerm = "";

    $http.get('/birds').then(function (response) {
        $scope.birds = response.data;
    }, function(error) {
        console.log("Error: " + error)
    });


    $scope.createBird = function() {
        var newBird = $scope.formData;
        $http.post('/birds', newBird)
        .then(function (response) {
            $scope.formData = {};
            $scope.birds = response.data;
        }, function (error){
            console.log('Error: ' + error);
        });
    };

    $scope.filter = function() {
        var search = $scope.searchTerm;
        $http.get('/birds', {params : {filter: search}})
        .then(function (response) {
            $scope.birds = response.data;
        }, function (error) {
            console.log('Error: ' + error);
        });
    }


    $scope.deleteBird = function(id) {
        $http.delete('/birds/' + id).then(function (response) {
            $scope.birds = response.data;
        }, function(error) {
            console.log('Error: ' + data);
        });
    };

}]);
