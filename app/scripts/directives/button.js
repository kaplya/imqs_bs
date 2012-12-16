
angular.module('ui')

.directive('button', ['$parse', function($parse) {
	'use strict';

	return {
		restrict: 'A',
		require: 'ngModel',
		link: function postLink(scope, element, attr, ctrl) {

			var getter = $parse(attr.ngModel),
				setter = getter.assign,
				method = attr.button ? $parse(attr.button) : undefined,
				undefTxt = attr.undefinedText !== "" ? attr.undefinedText : undefined,
				elmTxt = element.text();

			// Disable bootstrap embedded button toggling
			if(element.attr('data-toggle') === 'button') {
				element.removeAttr('data-toggle');
			}
			if(element.parent().attr('data-toggle') === 'buttons-checkbox') {
				element.parent().removeAttr('data-toggle');
			}

			// Watch model for changes instead
			scope.$watch(attr.ngModel, function(newValue, oldValue) {
				if(method && newValue !== undefined) {
					element.attr("disabled", null);
					element.text(elmTxt);
				} else if (method) {
					element.attr("disabled", "disabled");
					element.text(undefTxt);
				}

				if(!newValue) {
					element.removeClass('active');
				} else {
					element.addClass('active');
				}
			});

			// Click handling
			element.on('click', function(ev) {
				scope.$apply(function() {
					if(method) {
						method(scope);
					} else {
						setter(scope, !getter(scope));
					}
				});
			});

			// Initial state
			if(getter(scope)) {
				element.addClass('active');
			} else if(getter(scope) === undefined && method) {
				element.attr("disabled", "disabled");
			}
			
			if(undefTxt && method) {
				element.text(undefTxt);
			}

		}
	};

}]);
