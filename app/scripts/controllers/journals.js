'use strict';

imqsBsApp
  .factory('Journal', ['$resource', function ($resource) {
    return $resource('/journals/:id/:action');
  }])
  .controller('JournalsListCtrl', ['$scope', 'Journal', 'CrudB', '$location', function($scope, Journal, Crud, $location) {
    $scope.templates = {
      sb: 'views/journals_sb.html',
      body: 'views/journals.html'
    };
    
    var callbacks = Crud($scope, Journal);

    callbacks.afterCreate = function (d) {
      $location.path('/journals/:id/show'.replace(':id', d.id));
    };

    callbacks.beforeEdit = function (s) {
      $location.path('/journals/:id/show'.replace(':id', s.model.id));
      return false;
    };

  }])
  .controller('JournalFormCtrl', ["$scope", "$timeout", function($scope, $timeout) {
    $scope.linesShown = false;
    $scope.showLines = function () {
      if (!$scope.linesShown) {
        $scope.linesShown = undefined;
        $timeout(function () {
          $scope.linesShown = true;      
        }, 1000);
      } else {
        $scope.linesShown = false;
      }
    };
  }]);
