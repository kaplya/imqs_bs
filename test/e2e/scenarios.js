'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });


  it('should automatically redirect to /# when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/");
  });


  describe('items', function() {

    beforeEach(function() {
      browser().navigateTo('#/items');
    });

    it('should render items when user navigates to /items', function() {
      expect(element('h1:first').text()).toMatch(/Items/);
    });

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
