'use strict';

imqsBsApp.controller('JournalShowCtrl', ['$scope', '$route', function($scope, $route) {
  
	$scope.templates = {
	  // sb: 'views/journal_show.html',
	  body: 'views/journal_show.html'
	};

  $scope.id = $route.current.params.id;
}]);
