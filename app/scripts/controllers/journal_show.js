'use strict';

imqsBsApp
	.factory('Line', ['$resource', function ($resource) {
		return $resource('/lines/:id');
	}])
	.controller('JournalShowCtrl', ['$scope', '$route', 'Journal', 'Line', function($scope, $route, Journal, Line) {
	  
		$scope.templates = {
		  // sb: 'views/journal_show.html',
		  body: 'views/journal_show.html'
		};

	  var id = $route.current.params.id;
	  
	  Journal.get({ id: id }, function (d) {
			$scope.j = d;
	  });

	  Line.query({ journal_id: id}, function (d) {
	  	$scope.j.lines = d;
	  });

	}]);
