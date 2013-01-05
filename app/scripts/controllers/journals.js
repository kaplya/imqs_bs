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
    
    var callbacks = Crud.init($scope, Journal, { 
      itemsList: 'journals',
      itemModal: 'journalModal',
      item: 'j' 
    });

    callbacks.beforeEdit = function (s) {
      $location.path('/journals/:id/show'.replace(':id', s.j.id));
      return false;
    };

    callbacks.afterCreate = function (d) {
      $location.path('/journals/:id/show'.replace(':id', d.id));
    };

    // $scope.journals[0].lines = [
    // 	{date: "29.11.2012", item_code: "01", item_name: "Juice", qty: "10"},
    // 	{date: "29.11.2012", item_code: "02", item_name: "Potato", qty: "7"},
    // 	{date: "29.11.2012", item_code: "03", item_name: "Sugar", qty: "5"}
    // ];

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
