var app = angular.module('birds', []);
app.controller('BirdsController', ['$scope', function($scope) {
    $scope.birds = [
        {name : "polly", species : "parrot"},
        {name : "bruce", species : "cockatoo"},
        {name : "sam", species : "toucan"}
    ];

    $scope.makeBig = function() {
        for (var i = 0; i < $scope.birds.length; i++) {
            $scope.birds[i].name = $scope.birds[i].name.toUpperCase();
        }
    };

    $scope.formData = {};

    $scope.addBird = function() {
        $scope.birds.push($scope.formData);
        $scope.formData = {};
    }
}]);
