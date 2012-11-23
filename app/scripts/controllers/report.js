'use strict';

imqsBsApp.controller('ReportCtrl', function($scope) {
  $scope.templates = {};
  $scope.templates.body = "views/report.html";
  $scope.templates.sb = "views/report_sb.html";

  $scope.locations = [
	{ city: "Tokyo" },
	{ city: "Paris" }
  ];
});
