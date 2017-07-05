var app = angular.module('myApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'settings.html'
        })
});

app.controller('HomeController',['$scope', function($scope){
    $scope.selectedMail;
    $scope.setSelectedMail = function(mail) {
        $scope.selectedMail = mail;
    };

    $scope.isSelected = function(mail) {
        if ($scope.selectedMail) {
            return $scope.selectedMail === mail;
        }
    }
}]);

app.controller('SettingsController', ['$scope', function ($scope){
    $scope.settings = {
        name: 'Test',
        email: 'example@yandex.ru',
        age: 20
    };

    $scope.updateSettings = function() {
        console.log('updateSettings was called');
    };
}]);


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


app.controller('ContentController', ['$scope', function($scope){
    $scope.showingReply = false;

    $scope.showReply = function() {
        $scope.showingReply = true;
    };

    $scope.cancelReply = function() {
        $scope.showingReply = false;
    }
}]);