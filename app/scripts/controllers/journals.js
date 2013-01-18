'use strict';

imqsBsApp
  .factory('Journal', ['$resource', function ($resource) {
    return $resource('/journals/:id/:action');
  }])
  .controller('JournalsListCtrl', ['$scope', 'Journal', 'CrudC', '$location', function($scope, Journal, Crud, $location) {
    $scope.templates = {
      sb: 'views/journals_sb.html',
      body: 'views/journals.html'
    };
    
    Crud($scope, Journal, { modelName: 'j', modelsListName: 'journals'});

    $scope.$on('beforeEdit', function (e) {
      e.preventDefault();
      $location.path('/journals/:id/show'.replace(':id', e.targetScope.j.id));
    });

    $scope.$on('afterSuccessCreation', function (e, args) {
      $location.path('/journals/:id/show'.replace(':id', args.id));
    });

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
