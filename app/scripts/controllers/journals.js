'use strict';

imqsBsApp.controller('JournalsCtrl', function($scope) {
  $scope.templates = {};
  $scope.templates.sb = "views/journals_sb.html";
  $scope.templates.body = "views/journals.html";
  console.log("JournalsCtrl");
});
