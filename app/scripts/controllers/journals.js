'use strict';

imqsBsApp.controller('JournalsCtrl', function($scope) {
  $scope.templates = {};
  $scope.templates.sb = "views/journals_sb.html";
  $scope.templates.body = "views/journals.html";
  
  $scope.journals = [
  	{ number: "0001", date: "01.11.2012", j_type: "Supply", posted: "true" },
  	{ number: "0002", date: "02.11.2012", j_type: "Movement", posted: "false" },
  ]

});
