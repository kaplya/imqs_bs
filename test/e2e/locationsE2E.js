'use strict'

ddescribe('locations', function () {
	var ITEMS = 'tr[ng-repeat="i in itemsList"]',
		FORM = 'div[modal="modalEdit.shown"]',
		ROW = 'tbody tr:nth-child(?)',
		EDIT_BTN = 'button:contains("Edit")',
		SUBMIT_BTN = 'input[type="submit"]';
	
	beforeEach(function () {
		browser().navigateTo('/#/locations');
	});

	it('should render items when user navigates to /items', function () {
		expect(element('h1:first').text()).toMatch(/Locations/);
	});

	it('should have two locations', function () {
		expect(repeater(ITEMS).count()).toEqual(2);
	});
  
  it('should show filled edit form', function () {

    expect(element(FORM).css('display')).toEqual('none');
    
    using(ROW.replace('?', 2)).element(EDIT_BTN).click();
    expect(element(FORM).css('display')).toEqual('block');
    expect(input('modalEdit.data.name').val()).toEqual('Europe Store');
    expect(input('modalEdit.data.city').val()).toEqual('Paris');

    using(ROW.replace('?', 3)).element(EDIT_BTN).click();
    expect(element(FORM).css('display')).toEqual('block');
    expect(input('modalEdit.data.name').val()).toEqual('West Store');
    expect(input('modalEdit.data.city').val()).toEqual('Tokyo');

  });

  it('should submit edited data', function () {

  	for (var i=0; i<=1; i++) {
  		using(ROW.replace('?', i+2)).element(EDIT_BTN).click();
  		using(FORM).input('modalEdit.data.name').enter('TEST name');
  		using(FORM).input('modalEdit.data.city').enter('TEST city');
  		using(FORM).element(SUBMIT_BTN).click();
  		expect(element(FORM).css('display')).toEqual('none');
  		expect(repeater(ITEMS).row(i)).toEqual(['TEST name', 'TEST city']);
  	}

  });

});