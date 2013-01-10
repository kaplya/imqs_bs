'use strict';

describe('switch', function () {

	beforeEach(module('ui'));

	var scope,
		body,
		switchWnenElm,
		switchElm;


	beforeEach(inject(function (_$compile_, $rootScope) {
		var $compile = _$compile_;
		scope = $rootScope.$new();
		body = $('body');
		
		var switchWnenTmpl = '' + 
			'<div switch-when="a">A</div>' +
			'<div switch-when="b">B</div>' +
			'<div switch-when="c" switch-controller="Ctrl">C</div>';
		var switchTmpl = '<div switch="mode"></div>';
	
		var switchWnenTmpl = $(switchWnenTmpl).appendTo(body);
		var switchTmpl = $(switchTmpl).appendTo(body);

		switchWnenElm = $compile(switchWnenTmpl)(scope);
		switchElm = $compile(switchTmpl)(scope);

	}));

	it('should add elms to body', function () {
		var cases = body.data('switch');
		expect(cases['a']).toBeDefined();
		expect(cases['b']).toBeDefined();
	});

	it('should add and remove case element after the main element', function () {
		expect(switchElm.next().length).toBe(0);
		scope.$apply('mode="a"');
		expect(switchElm.next().length).toBe(1);
		scope.$apply('mode=""');
		expect(switchElm.next().length).toBe(0);
	});

	it('should hide/show main element', function () {
		expect(switchElm.css('display')).toBe('block');
		scope.$apply('mode="a"');
		expect(switchElm.css('display')).toBe('none');
		scope.$apply('mode=""');
		expect(switchElm.css('display')).toBe('block');
	});

	it('should create and destroy child scopes', function () {
		var getChildScope = function () {
			return switchElm.next('div[switch-when]').scope();
		};

		expect(getChildScope()).toBeUndefined();
		scope.$apply('mode="a"');
		var child1 = getChildScope();
		expect(child1).toBeDefined();
		spyOn(child1, '$destroy');
		scope.$apply('mode="x"');
		expect(child1.$destroy).toHaveBeenCalled();
		scope.$apply('mode="b"');
		var child2 = getChildScope();
		expect(child1).not.toBe(child2);
	});

	it('should apply controller on the new scope', function () {
		var b = false;
		scope.foo = 'Bar';
		var ss;
		scope.Ctrl = ['$scope', function ($scope) {
			b = true;
			ss = $scope;
		}];
		scope.$apply('mode="c"');
		expect(b).toBeTruthy();
		expect(scope.foo).toBe(ss.foo);
	});

});