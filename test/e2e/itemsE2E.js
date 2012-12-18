'use strict'

describe('items', function() {

  beforeEach(function() {
    browser().navigateTo('/#/items');
  });

  it('should render items when user navigates to /items', function() {
    expect(element('h1:first').text()).toMatch(/Items/);
  });

  it('should have three items', function () {
  	expect(repeater('tr[ng-repeat="i in items"]').count()).toEqual(3);
  });

  it('should show filled edit form', function () {
		var form = element("div[modal='modal.shown']");
		expect(form.css("display")).toEqual("none");
		
    using('tbody tr:nth-child(2)').element('button[ng-click="edit()"]').click();
    expect(input('modal.d.name').val()).toEqual("Tea");

    using('tbody tr:nth-child(3)').element('button[ng-click="edit()"]').click();
    expect(input('modal.d.name').val()).toEqual("Juice");

    using('tbody tr:nth-child(4)').element('button[ng-click="edit()"]').click();
    expect(input('modal.d.name').val()).toEqual("Beer");
    
  });

});