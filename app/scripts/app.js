'use strict';

var imqsBsApp = angular.module('imqsBsApp', ['$strap'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/items', {
        templateUrl: 'views/main.html',
        controller: 'ItemsCtrl',
      })
      .when('/journals', {
        templateUrl: 'views/main.html',
        controller: 'JournalsListCtrl'
      })
      .when('/locations', {
        templateUrl: 'views/main.html',
        controller: 'LocationsCtrl'
      })
      .when('/report', {
        templateUrl: 'views/main.html',
        controller: 'ReportCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .controller('NavCtrl', ["$rootScope", "$location", "$scope", function($rootScope, $location, $scope) {
    $rootScope.$on("$routeChangeSuccess", function (event, current) {
      var location = $location.path().substring(1);
      $scope.nav = {};
      $scope.nav[(location || 'home')] = "active";
    });
  }]);