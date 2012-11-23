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
        controller: 'JournalsCtrl'
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
  }]);
