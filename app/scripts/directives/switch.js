'use strict';

angular.module('ui')
	.directive('switchWhen', function () {
		return {
			transclude: 'element',
			compile: function (element, attrs, transclude) {
				var body = element.parents('body');
				var cases = body.data('switch') || {};
				cases[attrs.switchWhen] = transclude;
				body.data('switch', cases);
			}
		};
	})
	.directive('switch', function () {
		return {
			restrict: 'EA',
			compile: function (element, attr) {
				var watchExpr = attr.switch,
					cases = element.parents('body').data('switch') || {};
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
						if (selectedTransclude = cases[value]) {
							selectedScope = scope.$new();
							selectedTransclude(selectedScope, function (caseElement) {
								selectedElement = caseElement;
								element.append(caseElement);
							});
						}
					});
				};
			}
		}
	});