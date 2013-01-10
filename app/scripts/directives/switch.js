'use strict';

angular.module('ui')
	.directive('switchWhen', function () {
		return {
			transclude: 'element',
			compile: function (element, attrs, transclude) {
				var body = element.parents('body');
				var cases = body.data('switch') || {};
				cases[attrs.switchWhen] = {transclude: transclude};
				if (attrs.switchController) {
					cases[attrs.switchWhen].controller = attrs.switchController;
				}
				body.data('switch', cases);
			}
		};
	})
	.directive('switch', ['$controller', function ($controller) {
			return {
				restrict: 'EA',
				compile: function (element, attr) {
					var watchExpr = attr.switch,
						cases = angular.element('body').data('switch') || {};
					return function (scope, element) {
						var selectedTransclude,
							selectedElement,
							selectedScope;
						scope.$watch(watchExpr, function (value) {
							if (selectedElement) {
								selectedScope.$destroy();
								selectedElement.remove();
								selectedElement = selectedScope = null;
							}
							if (cases[value]) {
								selectedTransclude = cases[value].transclude;
								selectedScope = scope.$new();
								if (cases[value].controller) {
									$controller(cases[value].controller, { $scope: selectedScope });
								};
								selectedTransclude(selectedScope, function (caseElement) {
									selectedElement = caseElement;
									element.after(caseElement);
									element.css('display', 'none');
								});
							} else {
								element.css('display', '');
							}
						});
					};
				}
			}
		}]);