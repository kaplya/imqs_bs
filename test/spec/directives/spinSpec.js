describe('spin', function () {
	
	var scope, elm;
	beforeEach(module('ui'));

	beforeEach(inject(function ($compile, $rootScope) {
		scope = $rootScope.$new();
		elm = $compile('<div spin="state"></div>')(scope);
	}));

	it('should add and remove spin', function () {
		expect(elm.html()).toEqual('');
		
		scope.$apply(function (s) {
			s.state = true;
		});
		expect(elm.children('div.spinner')[0]).toBeDefined();

		scope.$apply(function (s) {
			s.state = false;
		});
		expect(elm.children('div.spinner')[0]).toBeUndefined();

	});

});