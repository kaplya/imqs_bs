angular.module('ui')
	.directive('prettyprint', [function () {
		return {
			restrict: 'C',
			link: function (scope, iElement, iAttr) {
				var r = prettyPrintOne(iElement.html());
				iElement.html(r);

			}
		}
	}]);