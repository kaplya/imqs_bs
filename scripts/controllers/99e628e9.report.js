'use strict';

imqsBsApp.controller('ReportCtrl', ["$scope", function($scope) {
  $scope.templates = {};
  $scope.templates.body = "views/report.html";
  $scope.templates.sb = "views/report_sb.html";

  $scope.locations = [
  { city: "Tokyo" },
  { city: "Paris" }
  ];

  $scope.lines = [
    {code: "0001", name: "Juice", location: "Tokyo", qty: "10"},
    {code: "0002", name: "Beer", location: "Moscow", qty: "15"},

  ];
}]);
