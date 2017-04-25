(function() {
    /* Create the angular frontend app */
    var app = angular.module('birds', ['ngFlash']);


    /* Controller for Bird Information */
    app.controller('BirdsController', ['$http', '$scope', 'currentUserService', 'authentication', function($http, $scope, currentUserService, authentication) {

        $scope.birds = [];      //Current list of birds to display
        $scope.formData = {};   //Current form data for a new bird
        $scope.searchTerm = ""; //Current filter term from search box

        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.currentUser = authentication.currentUser();
        $scope.$on("userBroadcast", function() {
            console.log("Bird Controller Update:",  currentUserService.isLoggedIn, currentUserService.currentUser);
            $scope.isLoggedIn = currentUserService.isLoggedIn;
            $scope.currentUser = currentUserService.currentUser;
        });

        /* Initially load in the current birds using API*/
        $http.get('/api/bird/retrieve').then(function (response) {
            $scope.birds = response.data;
        }, function(error) {
            console.log("Error: " + error)
        });


        /* Controller createBird() method to add a new bird */
        $scope.createBird = function() {
            /* Extract the data for the new bird */
            var newBird = $scope.formData;
            newBird.username = $scope.currentUser.username;
            /* POST the data to API */
            $http.post('/api/bird/add', newBird).then(function (response) {
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
            $http.get('/api/bird/retrieve', {params : {filter : search}})
            .then(function (response) {
                $scope.birds = response.data; //Update the list of current birds
            }, function (error) {
                console.log('Error: ' + error);
            });
        }


        /* Controller deleteBird(id) method to remove a bird from the list */
        $scope.deleteBird = function(id) {
            /* DELETE the data via the API using URL paramtere */
            $http.delete('/api/bird/delete/' + id).then(function (response) {
                console.log(response);
                $scope.birds = response.data; //Update the list of current birds
            }, function(error) {
                console.log(error);
            });
        };
    }]);

    app.service('authentication', ['$http', '$window', 'Flash', function($http, $window, Flash) {
        var saveToken = function (token) {
            console.log("SAVED");
            $window.localStorage['jwtoken'] = token;
            console.log("Just saved" + token);
        };

        var getToken = function () {
            return $window.localStorage['jwtoken'];
        };

        var logout = function() {
            $window.localStorage.removeItem('jwtoken');
        };

        var decodeToken = function(token) {
            payload = token.split('.')[1]; //Payload is second part of jwt
            //console.log(payload);
            payload = $window.atob(payload); //Base64 decode
            payload = JSON.parse(payload); //Convert to JSON
            return payload
        }
        var isLoggedIn = function() {
            var token = getToken();
            var payload;
            if(token){
                payload = decodeToken(token);
                return payload.exp > Date.now() / 1000; //Check if valid
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if(isLoggedIn()){
                var token = getToken();
                payload = decodeToken(token);
                return {
                    _id : payload._id,
                    username : payload.username,
                    role: payload.role
                };
            }
        };

        var register = function(user) {
            console.log("Called with", user);
            Flash.clear();
            return $http.post('/api/auth/register', user).then(function(response){
                saveToken(response.data.token);
                console.log("Success");
                console.log(response.data.token);
            }, function(error) {
                var message = error.data.error;
                console.log("register error", error);
                var id = Flash.create('danger', message, 0, true);
            });
        };

        var login = function(user) {

            return $http.post('/api/auth/login', user).then(function(response) {
                Flash.clear();
                Flash.create('success', "You have been logged in successfully",2000,true);
                saveToken(response.data.token);
                console.log("Token should be saved");
            }, function(error) {

                var message = error.data.error;
                console.log(error);
                Flash.clear();
                var id = Flash.create('danger', message, 0, true);
            });
        };
        return {
            saveToken : saveToken,
            getToken : getToken,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            logout : logout,
            register: register,
            login: login
        };
    }]);


    app.controller("LoginController",['$scope', '$window', 'authentication', 'currentUserService','Flash', function($scope, $window, authentication, currentUserService, Flash) {
        $scope.formData = {
            username : "",
            password : ""
        };
        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.currentUser = authentication.currentUser();
        $scope.$on("userBroadcast", function() {
            $scope.isLoggedIn = currentUserService.isLoggedIn;
            $scope.currentUser = currentUserService.currentUser;
            console.log("Login received update",$scope.isLoggedIn,$scope.currentUser);
        });
        $scope.login = function () {
            authentication
            .login($scope.formData)
            .then(function (data) {currentUserService.broadcastUpdate();}, function(err){
                alert(err);
            });

        };

        $scope.logout = function () {
            console.log("logging out");
            authentication
            .logout();
            currentUserService.broadcastUpdate();
        };

        $scope.register = function () {
            console.log($scope.formData);
            authentication
            .register($scope.formData)
            .then(function(response) {currentUserService.broadcastUpdate();} , function(err){
                console.log("Register error " + err.error);
            });

        };

    }]);

    app.factory("currentUserService", function($rootScope, authentication) {
        var sharedService = {};
        sharedService.isLoggedIn = authentication.isLoggedIn();
        sharedService.currentUser = authentication.currentUser();

        sharedService.broadcastUpdate = function() {
            this.isLoggedIn = authentication.isLoggedIn();
            this.currentUser = authentication.currentUser();
            console.log("Broadcasting", this.isLoggedIn, this.currentUser);
            $rootScope.$broadcast('userBroadcast');
        };

        return sharedService;
    })
    app.run(function(currentUserService) {
        currentUserService.broadcastUpdate();
        console.log("Did the run broadcast");
    });
})();
