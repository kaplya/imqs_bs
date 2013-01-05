'use strict';

ddescribe('Service: Crud B', function () {

  beforeEach(module('imqsBsApp'));

  var crud, $httpBackend, scope, resource, callbacks;
  beforeEach(inject(function(_CrudB_, _$httpBackend_, $rootScope, $resource) {
    resource = $resource('/items/:id/:action');
    crud = _CrudB_;
    scope = $rootScope;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('default otions', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items').respond([{foo: 'Bar'}]);
      callbacks = crud(scope, resource);
    });

    it('should query data', function () {
        expect(scope.list).toBeUndefined();
        $httpBackend.flush();
        expect(scope.list.length).toBe(1);
    });

    it('should manage loading items spin', function () {
      expect(scope.spin).toBeTruthy();
      $httpBackend.flush();
      expect(scope.spin).toBeFalsy();
    });

    describe('edit item', function () {

      it('should get data and show form when open edit modal form', function () {
        expect(scope.edit.shown).toBeFalsy();
        $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
        
        scope.edit.call({ item: { id: 1 } });
        expect(scope.edit.data).toEqual({});    

        $httpBackend.flush();
        expect(scope.edit.shown).toBeTruthy();
        expect(scope.edit.data.id).toBe(1);
      });

      it('should manage spin when open form', function () {
        $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
        scope.edit.call({ item: { id: 1 } });
        expect(scope.edit.spin).toBeTruthy();
        $httpBackend.flush();
        expect(scope.edit.spin).toBeFalsy();
      });
    
      it('should submit edited data and close form', function () {

        expect(scope.edit.shown).toBeFalsy();

        $httpBackend.expect('PUT', '/items/1').respond({ id: 1, foo: 'Bar' });
        scope.edit.data = { id: 1, error: 'test' };
        scope.edit.listData = {};
        scope.createOrUpdate();
        expect(scope.edit.data.error).toBeUndefined();
        $httpBackend.flush();
        expect(scope.edit.shown).toBeFalsy();
        expect(scope.edit.listData.foo).toEqual('Bar');
      });

      it('should manage spin while submitting', function () {
        $httpBackend.expect('PUT', '/items/1').respond({ id: 1, foo: 'Bar' });
        scope.edit.data = { id: 1, error: 'test' };
        scope.createOrUpdate();
        expect(scope.edit.spin).toBeTruthy();
        $httpBackend.flush();
        expect(scope.edit.spin).toBeFalsy();
      });

      it('should fill errors', function () {
        $httpBackend.when('PUT', '/items/1').respond(400, { foo: 'Bar' });
        scope.edit.data = { id: 1 };
        scope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.edit.data.error.foo).toEqual('Bar');
      });

      it('in case of errors should stop spinning and keep form opend', function () {
        $httpBackend.when('PUT', '/items/1').respond(400, { foo: 'Bar' });
        scope.edit.shown = true;
        scope.edit.data = { id: 1 };
        scope.createOrUpdate();
        expect(scope.edit.spin).toBeTruthy();
        $httpBackend.flush();
        expect(scope.edit.spin).toBeFalsy();
        expect(scope.edit.shown).toBeTruthy();
      });

    });

    describe('new item', function () {

      it('should clear data and show new form', function () {
        $httpBackend.flush();
        scope.edit.data = { foo: 'Bar' };
        scope.new();
        expect(scope.edit.data).toEqual({});
        expect(scope.edit.shown).toBeTruthy();
      });

      it('should submit new data and hide form', function () {
        $httpBackend.expect('POST', '/items').respond();
        scope.edit.data = { foo: 'Bar' };
        scope.list = [];
        scope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.list[1].foo).toBe('Bar');
      });

      it('should manage spin while submitting new data', function () {
        $httpBackend.expect('POST', '/items').respond();
        scope.edit.data = { foo: 'Bar' };
        scope.list = [];
        scope.createOrUpdate();
        expect(scope.edit.spin).toBeTruthy();
        $httpBackend.flush();
        expect(scope.edit.spin).toBeFalsy();
      });

      it('should show error', function () {
        $httpBackend.when('POST', '/items').respond(400, { foo: 'Bar' });
        scope.edit.data = {};
        scope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.edit.data.error.foo).toEqual('Bar');
      });

      it('should keep form opend and stop spinning if errors occur', function () {
        $httpBackend.when('POST', '/items').respond(400, { foo: 'Bar' });
        scope.edit.shown = true;
        scope.edit.data = {};
        scope.createOrUpdate();
        expect(scope.edit.spin).toBeTruthy();
        $httpBackend.flush();
        expect(scope.edit.spin).toBeFalsy();
        expect(scope.edit.shown).toBeTruthy();
      });

    });

    describe('delete item', function () {

      it('should clear errors and show del form', function () {
        $httpBackend.flush();
        scope.modalDel = { error: {foo: 'Bar'} };
        expect(scope.modalDel.shown).toBeFalsy();
        scope.delete.call( { item: { id: 1 } } );
        expect(scope.modalDel.listData.id).toBe(1);
        expect(scope.modalDel.error).toBeUndefined();
        expect(scope.modalDel.shown).toBeTruthy();
      });

      it('should delete item and hide form', function () {
        $httpBackend.flush();
        scope.modalDel.listData = { id: 1 };
        expect(scope.list.length).toBe(1);
        
        $httpBackend.expect('DELETE', '/items/1').respond();
        scope.modalDel.shown = true;
        scope.destroy();
        $httpBackend.flush();
        expect(scope.modalDel.shown).toBeFalsy();
        expect(scope.list.length).toBe(0);
      });
      
      it('should manage errors', function () {
        $httpBackend.when('DELETE', '/items/1').respond(400, { foo: 'Bar' });
        scope.modalDel.listData = { id: 1 };
        scope.destroy();
        $httpBackend.flush();
        expect(scope.modalDel.error.foo).toEqual('Bar');
      });

      it('should keep form opened and stop spinning if errors occur', function () {
        $httpBackend.when('DELETE', '/items/1').respond(400, { foo: 'Bar' });
        scope.modalDel.shown = true;
        scope.modalDel.listData = { id: 1 };
        scope.destroy();
        expect(scope.modalDel.spin).toBeTruthy();
        $httpBackend.flush();
        expect(scope.modalDel.spin).toBeFalsy();
        expect(scope.modalDel.shown).toBeTruthy();
      });
    });
    
    describe('callbacks', function () {
        
      describe('before edit', function () {
        
        afterEach(function () {
          $httpBackend.flush();
        });

        beforeEach(function () {
          $httpBackend.when('GET', '/items/1').respond({ id: 1 });
        });

        it('should call beforeEdit', function () {
          var t = false;
          callbacks.beforeEdit = function () {
            t = true;
          };
          scope.edit.call({item: {id: 1}});
          expect(t).toBeTruthy();
        });

        it('should stop default action if beforeEdit return false', function () {
          callbacks.beforeEdit = function () {
            return false;
          };
          scope.edit.call({ item: {id: 1} });
          expect(scope.edit.shown).toBeFalsy();
        });

        it('should call with scope where method was called', function () {
          var ss;
          callbacks.beforeEdit = function (s) {
            ss = s;
          };
          var s = { item: {id: 1} };
          scope.edit.call(s);
          expect(s).toBe(ss);
        });

      });

      describe('after create', function () {
        
        beforeEach(function () {
          $httpBackend.when('POST', '/items').respond({ id: 1 });
        });

        it('should call after create', function () {
          scope.edit = { data: {}};
          var t = false, r;
          callbacks.afterCreate = function (rr) {
            t = true;
            r = rr;
          }
          scope.createOrUpdate();
          $httpBackend.flush();
          expect(t).toBeTruthy();
          expect(r.id).toBe(1);
        });

      });
    });
  });

  describe('init request', function () {
    
    it('should load item by id', function () {
      $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
      var callbacks = crud(scope, resource, { 
        initRequest: 'item',
        initRequestParams: { id: 1 }
      });
      $httpBackend.flush();
      expect(scope.item.id).toBe(1);
    });

    it('should load list with params', function () {
      $httpBackend.expect('GET', '/items?filter=1').respond([{ id: 1 }]);
      var callbacks = crud(scope, resource, { 
        initRequest: 'list',
        initRequestParams: { filter: 1 }
      });
      $httpBackend.flush();
      expect(scope.list[0].id).toBe(1);
    });

  });

});