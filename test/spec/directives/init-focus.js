'use strict';

describe('Directive: initFocus', function() {
  beforeEach(module('imqsBsApp'));

  var element;

  it('should make hidden element visible', inject(function($rootScope, $compile) {
    element = angular.element('<init-focus></init-focus>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the initFocus directive');
  }));
});
