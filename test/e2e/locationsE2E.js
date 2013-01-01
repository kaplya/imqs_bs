'use strict'

describe('locations', function () {
	var ITEMS = 'tr[ng-repeat="i in itemsList"]',
		FORM = 'div[modal="modalEdit.shown"]',
		ROW = 'tbody tr:nth-child(?)',
		EDIT_BTN = 'button:contains("Edit")',
		SUBMIT_BTN = 'input[type="submit"]',
		NEW_BTN = 'button:contains("New")',
		DEL_BTN = 'button:contains("Delete")',
		YES_BTN = 'button:contains("Yes")',
		DEL_FORM = 'div[modal="modalDel.shown"]';
	
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

  it('should show empty new form', function () {
  	input('modalEdit.data.name').enter('Bar');
  	element(NEW_BTN).click();
  	expect(element(FORM).css('display')).toEqual('block');
  });

  it('should submit new data', function () {
  	element(NEW_BTN).click();
  	using(FORM).input('modalEdit.data.name').enter('New name');
  	using(FORM).input('modalEdit.data.city').enter('New city');
  	using(FORM).element(SUBMIT_BTN).click();
  	expect(element(FORM).css('display')).toEqual('none');
  	expect(repeater(ITEMS).row(0)).toEqual(['New name', 'New city']);
  });

  it('should edit submitted data', function () {
  	element(NEW_BTN).click();
  	using(FORM).input('modalEdit.data.name').enter('name');
  	using(FORM).element(SUBMIT_BTN).click();
  	using(ROW.replace('?', 2)).element(EDIT_BTN).click();
  	expect(using(FORM).input('modalEdit.data.name').val()).toEqual('name');
  });

  it('should show delete form', function () {
  	expect(element(DEL_FORM).css('display')).toEqual('none');
  	using(ROW.replace('?', 2)).element(DEL_BTN).click();
  	expect(element(DEL_FORM).css('display')).toEqual('block');
  });

  it('should delete', function () {
  	using(ROW.replace('?', 2)).element(DEL_BTN).click();
  	using(DEL_FORM).element(YES_BTN).click();
  	expect(element(DEL_FORM).css('display')).toEqual('none');
  	expect(repeater(ITEMS).row(0)).toEqual(['West Store', 'Tokyo']);
  });

});