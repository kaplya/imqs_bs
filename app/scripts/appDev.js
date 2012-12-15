var imqsBsAppDev = angular.module('imqsBsAppDev', ['imqsBsApp', 'ngMockE2E'])
  .run(["$httpBackend", function($httpBackend) {
  	$httpBackend.whenGET(/^views\//).passThrough();
  }]);