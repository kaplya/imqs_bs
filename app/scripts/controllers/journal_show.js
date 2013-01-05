'use strict';

imqsBsApp
	.factory('Line', ['$resource', function ($resource) {
		return $resource('/lines/:id');
	}])
	.controller('JournalShowCtrl', ['$scope', '$route', 'Journal', 'CrudB', function($scope, $route, Journal, Crud) {
	  
		$scope.templates = {
		  // sb: 'views/journal_show.html',
		  body: 'views/journal_show.html'
		};

	  var id = $route.current.params.id;

	  Crud($scope, Journal, {
	  	models: {
	  		item: 'journal'
	  	},
	  	initRequest: 'item',
	  	initRequestParams: { id: id }
	  });

	  $scope.linesCtrl = ['$scope', 'Line', function ($scope, Line) {
		  Crud($scope, Line, {
		  	models: {
		  		list: 'lines',
		  		item: 'l'
		  	},
		  	initRequestParams: { journal_id: id }
		  });
	  }];

	}]);
