'use strict';

describe('switch', function () {

	beforeEach(module('ui'));

	var scope,
		switchWnenElm,
		switchElm,
		body;

	beforeEach(inject(function ($compile, $rootScope) {
		scope = $rootScope.$new();
		body = $('body');
		
		var switchWnenTmpl = '' + 
			'<div switch-when="a">A</div>' +
			'<div switch-when="b">B</div>',
			switchTmpl = '<div switch="mode"></div>';
	
		switchWnenTmpl = $(switchWnenTmpl).appendTo(body);
		switchTmpl = $(switchTmpl).appendTo(body);

		switchWnenElm = $compile(switchWnenTmpl)(scope);
		switchElm = $compile(switchTmpl)(scope);
	}));

	it('should add elms to body', function () {
		var cases = body.data('switch');
		expect(cases['a']).toBeDefined();
		expect(cases['b']).toBeDefined();
	});

	it('should append and remove case element', function () {
		expect(switchElm.children().length).toBe(0);
		scope.$apply('mode="a"');
		expect(switchElm.children().length).toBe(1);
		scope.$apply('mode=""');
		expect(switchElm.children().length).toBe(0);
	});

	it('should create and destroy child scopes', function () {
		var getChildScope = function () {
			return switchElm.children('div[switch-when]').scope();
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

});