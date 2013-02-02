'use strict';

imqsBsApp
  .factory('Journal', ['$resource', function ($resource) {
    return $resource('/journals/:id/:action');
  }])
  .controller('JournalsListCtrl', ['$scope', 'Journal', 'Crud', '$location', function($scope, Journal, Crud, $location) {
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

    $scope.ShowFormCtrlExt = ["$scope", "Line", '$controller', function ($scope, Line, $controller) {
      $controller('ShowFormCtrl', { $scope: $scope });
      $scope.linesShown = false;
      $scope.showLines = function () {
        if (!$scope.linesShown) {
          $scope.linesShown = undefined;
          Line.query({ journal_id: $scope.j.id }, function (data) {
            $scope.j.lines = data;
            $scope.linesShown = true;
          });
        } else {
          $scope.linesShown = false;
        }
      };
    }];

  }]);
