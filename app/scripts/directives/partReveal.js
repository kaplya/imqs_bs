'use strict';

angular.module('ui')
	.directive('part', function () {
		var body = angular.element('body');
		return {
			transclude: 'element',
			compile: function (element, attrs, transclude) {
				if (!body.data('reveal')) {
					body.data('reveal', {});
				}
				var c = { transclude: transclude };
				c.is = attrs.is || 'modal';
				if (attrs.partController) {
					c.controller = attrs.partController;
				}
				body.data('reveal')[attrs.part] = c;
			}
		};
	})
	.directive('reveal', ['$controller', function ($controller) {
		var opts = {
			modal: { 
				insert: 'body',
				hide: false },
			row: { 
				insert: 'after',
				hide: true }
		};
		return {
			restrict: 'EA',
			compile: function (element, attrs) {
				if (!angular.element('body').data('reveal')) {
					angular.element('body').data('reveal', {});
				};
				var watchExpr = attrs.on || attrs.reveal,
					cases = angular.element('body').data('reveal');
				return function (scope, element) {
					
					function destroy() {						
						if (selectedElement) {
							selectedScope.$destroy();
							selectedElement.remove();
							selectedElement = selectedScope = null;
						}
					};

					var selectedTransclude,
						selectedElement,
						selectedScope,
						c;
					
					element.bind('destroyed', function () {
						destroy();
					});
					
					scope.$watch(watchExpr, function (value) {
						destroy();
						if (c = cases[value]) {
							var caseOpts = opts[c.is];
							selectedTransclude = c.transclude;
							selectedScope = scope.$new();
							if (c.controller) {
								$controller(c.controller, { $scope: selectedScope });
							};
							selectedTransclude(selectedScope, function (caseElement) {
								selectedElement = caseElement;
								if (caseOpts.insert == 'after') {
									element.after(caseElement);
								} else if (caseOpts.insert == 'body') {
									caseElement.appendTo('body');
								}
								if (caseOpts.hide) {
									element.css('display', 'none');
								};
							});
						} else {
							element.css('display', '');
						}
					});
				};
			}
		}
	}]);