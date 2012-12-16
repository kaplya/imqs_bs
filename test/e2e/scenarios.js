'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should automatically redirect to /# when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/");
  });

  xdescribe('locations', function() {

    beforeEach(function() {
      browser().navigateTo('#/locations');
    });


    it('', function() {
      expect(element('').text()).
        toMatch(/partial for view 2/);
    });

  });
});
