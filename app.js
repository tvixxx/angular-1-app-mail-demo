var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
   $routeProvider
       .when('/', {
       templateUrl: "./home.html",
       controller: 'HomeController'
       })
       .when('/settings', {
           templateUrl: "./settings.html",
           controller: 'SettingsController'
       })
       .otherwise({redirectTo: '/'});
});

app.controller('HomeController', function($scope){
    $scope.selectedMail;
    $scope.setSelectedMail = function(mail) {
      $scope.selectedMail = mail;
    };

    $scope.isSelected = function(mail) {
        if ($scope.selectedMail) {
            return $scope.selectedMail === mail;
        }
    }
});

app.controller('SettingsController', function($scope){
    $scope.settings = {
        name: 'Test',
        email: 'example@yandex.ru',
        age: 20
    };

    $scope.updateSettings = function() {
      console.log('updateSettings was called');
    };
});

app.controller('MailListingController', ['$scope', '$http',  function($scope, $http){
    $scope.email = [];

    $http({
        method: 'GET',
        url: './api/mail/mail.json'
    })
    .success(function(data, status, headers){
        $scope.email = data.all;
    })
    .error(function(data, status, headers){
        $scope.email = data;
    });
}]);

app.controller('ContentController', function($scope){

});