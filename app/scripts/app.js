'use strict';

var imqsBsApp = angular.module('imqsBsApp', ['ngResource', 'ui'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/promo.html',
        controller: 'PromoCtrl'
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
      .when('/journals/:id/show', {
        templateUrl: 'views/main.html',
        controller: 'JournalShowCtrl'
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
  }])
  .config(['$provide', function ($provide) {
    $provide.decorator('$resource', ['$delegate', function ($delegate) {
      return (function (url) {
        var ACTIONS = {
            'update': {method: 'PUT'},
            'create': {method: 'POST'},
            'destroy': {method: 'DELETE'}
          };
        return $delegate(url, {}, ACTIONS);
      });
    }]);
  }]);

  angular.module('ui', [])
    .value('config', {
      datepicker: { format: 'dd.mm.yyyy' }
    });

(function($){
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(angular.element);