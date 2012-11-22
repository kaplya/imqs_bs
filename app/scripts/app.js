'use strict';

var imqsBsApp = angular.module('imqsBsApp', ['$strap.directives'])
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
      .otherwise({
        redirectTo: '/'
      });
  }]);
