describe('spin', function () {
	
	var scope, elm;
	beforeEach(module('ui'));

	beforeEach(inject(function ($compile, $rootScope) {
		scope = $rootScope.$new();
		elm = $compile('<div spin="state">'
			+ '<input>'
			+ '<select><option>one</option></select>'
			+ '<button type="button">Click</button>'
			+ '<textarea>Test</textarea>'
			+ '</div>')(scope);
	}));

	it('should add and remove spin', function () {
		expect(elm.children('div.spinner')[0]).toBeUndefined();
		
		scope.$apply(function (s) {
			s.state = true;
		});
		expect(elm.children('div.spinner')[0]).toBeDefined();

		scope.$apply(function (s) {
			s.state = false;
		});
		expect(elm.children('div.spinner')[0]).toBeUndefined();

	});

	it('should disable elements', function () {
		
		function test(i) {
			expect(i.attr('disabled')).toBeUndefined();

			scope.$apply(function (s) {
				s.state = true;
			});
			expect(i.attr('disabled')).toEqual('disabled');

			scope.$apply(function (s) {
				s.state = false;
			});
			expect(i.attr('disabled')).toBeUndefined();
		};

		var i = elm.find('input');
		test(i);

		i = elm.find('select');
		test(i);

		i = elm.find('button');
		test(i);

		i = elm.find('textarea');
		test(i);
	});

	xit('should disable close modal on escape and click on backdrop', function () {
		scope.$apply("show=true");
		scope.$apply("state=true");
		expect(elm).toHaveClass('in');
		
		$("body").trigger({type :'keyup', which: 27});
		expect(elm).toHaveClass('in');
		
		$(".modal-backdrop").click();
		expect(elm).toHaveClass('in');

		scope.$apply("state=false");
		$("body").trigger({type :'keyup', which: 27});
		expect(elm).not.toHaveClass('in');
		
		scope.$apply("show=true");
		expect(elm).toHaveClass('in');
		
		$(".modal-backdrop").click();
		expect(elm).not.toHaveClass('in');
	});

});