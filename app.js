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

app.service('mailService', ['$http', '$q', function($http, $q) {
    var getMail = function() {
        return $http({
            method: 'GET',
            url: './api/mail/mail.json'
        });
    };

    var sendMail = function(mail) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: mail,
            url: '/api/send'
        }).success(function(data, status, header) {
            def.resolve(data);
        }).error(function(data, status, header) {
           def.reject(data, status);
        });
        return def.promise;
    };

    return {
        getMail: getMail,
        sendMail: sendMail
    }
}]);

app.controller('HomeController',['$scope', function($scope){
    $scope.openModal = false;
    // $scope.closeModalOnEsc = function(event) {
    //     if (event.which === 27) {
    //         $scope.openModal = false;
    //     }
    // };
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

app.directive('escKey', function () {
    return function (scope, element, attrs) {
        element.bind('keypress', function (event) {
            console.log(event);
            if(event.which === 27) { // 27 = esc key
                scope.$apply(function (){
                    scope.$eval(attrs.escKey);
                });

                event.preventDefault();
            }
        });
    };
});

app.controller('MailListingController', ['$scope', 'mailService',  function($scope, mailService){
    $scope.email = [];
    $scope.nYearsAgo = 10;
    $scope.yearsFilterEnable = false;

    mailService
        .getMail()
        .success(function(data, status, headers){

            $scope.email = data.all;
        })
        .error(function(data, status, headers){
            $scope.email = data;
        });

    $scope.searchPastNYears = function(email) {
        var emailSentAtDate = new Date(email.sent_at);
        var nYearsAgoDate = new Date();

        nYearsAgoDate.setFullYear(nYearsAgoDate.getFullYear() - $scope.nYearsAgo);
        return emailSentAtDate > nYearsAgoDate;
    }
}]);

app.directive('emailListing', function(){
    return {
        restrict: 'EA',
        replace: false,
        scope: {
            email: '=',
            action: '&'
        },
        templateUrl: 'email-listing.html',
        controller: ['$scope', '$element', '$attrs', '$transclude',
            function($scope, $element, $attrs, $transclude) {
                $scope.handleClick = function () {
                    $scope.action({selectedMail: $scope.email});
                }
            }
        ],
        compile: function(tElement, tAttrs, transclude) {

        },
        link: function(scope, iElement, iAttrs, controller) {
            scope.$watch('from', function() {

            })
        }
    }
});


app.controller('ContentController', ['$scope', 'mailService', function($scope, mailService){
    $scope.err = {
        mainError: 'error network!'
    };

    $scope.errorText = null;

    $scope.showReply = function() {
        $scope.reply = {};
        $scope.reply.to = $scope.selectedMail.from;
        $scope.reply.body = "\n\n ------------------\n\n" + $scope.selectedMail.body;
        $scope.showingReply = true;
    };

    $scope.$watch('selectedMail', function() {
        $scope.showingReply = false;
        $scope.reply = {};
    });

    $scope.cancelReply = function() {
        $scope.showingReply = false;
        $scope.errorText = null;
    };

    $scope.sendReply = function() {
        $scope.loading = true;
        mailService
            .sendMail($scope.reply)
            .then(function(data) {
                console.log(data);
                $scope.loading = false;

                $scope.showingReply = false;
            }, function(err, status) {
                if (err) {
                    $scope.errorText = $scope.err.mainError;
                    $scope.loading = false;
                }

                console.log(err);
            });
    }
}]);