'use strict';

imqsBsApp
.controller('JournalsListCtrl', ["$scope", function($scope) {
  $scope.templates = {};
  $scope.templates.sb = "views/journals_sb.html";
  $scope.templates.body = "views/journals.html";
  
  $scope.journals = [
  	{ number: "0001", date: "01.11.2012", j_type: "Supply", posted: "true" },
  	{ number: "0002", date: "02.11.2012", j_type: "Movement", posted: "false" }
  ]

  $scope.journals[0].lines = [
  	{date: "29.11.2012", item_code: "01", item_name: "Juice", qty: "10"},
  	{date: "29.11.2012", item_code: "02", item_name: "Potato", qty: "7"},
  	{date: "29.11.2012", item_code: "03", item_name: "Sugar", qty: "5"}
  ];

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
