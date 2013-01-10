'use strict';

describe('Service: Crud C', function () {

  beforeEach(module('imqsBsApp'));

  var crud, $httpBackend, $controller, scope, resource, callbacks;
  beforeEach(inject(function(_CrudC_,  _$httpBackend_, $rootScope, $resource, _$controller_) {
    resource = $resource('/items/:id/:action');
    crud = _CrudC_;
    scope = $rootScope;
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    // $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('init list', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items').respond([{ id: 1 }]);
      crud(scope, resource);
    });

    it('should load list', function () {
      expect(scope.modelsList).toBeUndefined();
      $httpBackend.flush();
      expect(scope.modelsList[0].id).toEqual(1);
    });

    it('should manage isBusy attr', function () {
      expect(scope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(scope.isBusy).toBeFalsy();
    });

    it('should open new form', function () {
      scope.new();
      expect(scope.mode).toBe('NewOrEdit');
      expect(scope.isShown).toBeTruthy();
    });

  });

  describe('init item', function () {
    
    beforeEach(function () {
      $httpBackend.expect('GET', '/items/1').respond({ id: 1 });
      crud(scope, resource, {
        initRequest: 'item',
        initRequestParams: { id: 1 }
      });
    });

    it('should load item', function () {
      expect(scope.model).toBeUndefined();
      $httpBackend.flush();
      expect(scope.model.id).toBe(1);
    });

    it('should manage isBusy attr', function () {
      expect(scope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(scope.isBusy).toBeFalsy();
    });    

  });
  
  describe('NewEditFormCtrl', function () {

    var fScope;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      $httpBackend.when('GET', '/items/1').respond({ id: 1 });
      crud(scope, resource);
      scope.model = { id: 1 };
      fScope = scope.$new();
    });
    
    it('should open form', function () {
      expect(fScope.isShown).toBeFalsy();
      $controller('FormCtrl', { $scope: fScope });
      expect(fScope.isShown).toBeTruthy();
    });

    it('should not load data if model is not present', function () {
      scope.model = undefined;
      $controller('FormCtrl', { $scope: fScope });
    });

    it('should init model if null or undefined', function () {
      scope.model = null;
      $controller('FormCtrl', { $scope: fScope });
      expect(fScope.model).toEqual({});
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      $controller('FormCtrl', { $scope: fScope });
      expect(fScope.errors).toBeUndefined();
    });
    
    it('should load data', function () {
      $httpBackend.expect('GET', '/items/2').respond({ id: 2, foo: 'Bar 2' });
      scope.model = { id: 2, foo: 'Bar 1'};
      $controller('FormCtrl', { $scope: fScope });
      expect(fScope.model.foo).toEqual('Bar 1');
      
      $httpBackend.flush();
      expect(fScope.model.foo).toEqual('Bar 2');
    });

    it('should manage isBusy attr', function () {
      $controller('FormCtrl', { $scope: fScope });
      expect(fScope.isBusy).toBeTruthy();
      $httpBackend.flush();
      expect(fScope.isBusy).toBeFalsy();
    });

    it('should close the form', function () {
      $controller('FormCtrl', { $scope: fScope });
      fScope.cancel();
      expect(fScope.isShown).toBeFalsy();
      expect(fScope.$parent.mode).toBe(null);
    });

    describe('create', function () {
      
      var fScope, callbacks;
      beforeEach(function () {
        $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
        callbacks = crud(scope, resource);
        fScope = scope.$new();
        $controller('FormCtrl', { $scope: fScope });
        fScope.isShown = true;
        fScope.model = { foo: 'Bar' };
      });

      it('should clean errors', function () {
        $httpBackend.when('POST', '/items').respond();
        fScope.errors = {};
        fScope.createOrUpdate();
        expect(fScope.errors).toBeUndefined();
      });

      it('should manage isBusy', function () {
        $httpBackend.when('POST', '/items').respond();
        fScope.createOrUpdate();
        expect(fScope.isBusy).toBeTruthy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      it('should post data', function () {
        $httpBackend.expect('POST', '/items', fScope.model).respond();
        fScope.createOrUpdate();
      });

      it('should unshift data to modelsList', function () {
        var v = { id: 2 };
        $httpBackend.when('POST', '/items').respond(200, v);
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.modelsList[0].id).toBe(2);
      });

      it('should close form', function () {
        $httpBackend.when('POST', '/items').respond();
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(fScope.isShown).toBeFalsy();
        expect(fScope.$parent.mode).toBeNull();
      });

      it('should fill errors', function () {
        var e = { foo: 'Bar' };
        $httpBackend.when('POST', '/items').respond(400, e);
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(fScope.errors).toBe(e);
      });

      it('should manage isBusy if errors', function () {
        $httpBackend.when('POST', '/items').respond(400);
        fScope.createOrUpdate();
        expect(fScope.isBusy).toBeTruthy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      it('should not close form if error', function () {
        $httpBackend.when('POST', '/items').respond(400);
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(fScope.isShown).toBeTruthy();
      });

    //   it('should call afterCreate callback', function () {
    //     $httpBackend.when('POST', '/items').respond();
    //     var r = false;
    //     callbacks.afterCreate = function () {
    //       r = true;
    //     };
    //     fScope.createOrUpdate();
    //     $httpBackend.flush();
    //     expect(r).toBeTruthy();
    //   });

    //   it('should call afterCreate with created model', function () {
    //     var m = { foo: 'Bar' };
    //     $httpBackend.when('POST', '/items').respond(200, m);
    //     var mm;
    //     callbacks.afterCreate = function (d) {
    //       mm = d;
    //     };
    //     fScope.createOrUpdate();
    //     $httpBackend.flush();
    //     expect(m.foo).toBe(mm.foo);
    //   });

    });

    describe('update', function () {
      var fScope;

      beforeEach(function () {
        $httpBackend.when('GET','/items').respond([{ id: 1 }]);
        crud(scope, resource);
        fScope = scope.$new();
        $controller('FormCtrl', { $scope: fScope });
        fScope.isShown = true;
        scope.model = { id: 1, foo: 'Bar' };
        fScope.model = { id: 1, foo: 'Bar' };
      });

      it('should clean errors', function () {
        $httpBackend.when('PUT', '/items/1').respond();
        fScope.errors = {};
        fScope.createOrUpdate();
        expect(fScope.errors).toBeUndefined();
      });

      it('should manage isBusy', function () {
        $httpBackend.when('PUT', '/items/1').respond();
        fScope.createOrUpdate();
        expect(fScope.isBusy).toBeTruthy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      it('should put data', function () {
        $httpBackend.expect('PUT', '/items/1', fScope.model).respond();
        fScope.createOrUpdate();
      });

      it('should update initial data', function () {
        var r = { id: 1, foo: 'Bar New'};
        $httpBackend.when('PUT', '/items/1').respond(200, r);
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.model.foo).toBe('Bar New');
      });

      it('should close form', function () {
        $httpBackend.when('PUT', '/items/1').respond();
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(fScope.isShown).toBeFalsy();
      });

      it('should set mode to empty', function () {
        scope.mode = 'Foo';
        $httpBackend.when('PUT', '/items/1').respond();
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(scope.mode).toBeNull();
      });

      it('should fill errors', function () {
        var e = { foo: 'Bar' };
        $httpBackend.when('PUT', '/items/1').respond(400, e);
        fScope.createOrUpdate();
        $httpBackend.flush();
        expect(fScope.errors).toBe(e);
      });

      it('should manage isBusy if errors', function () {
        $httpBackend.when('PUT', '/items/1').respond(400);
        fScope.createOrUpdate();
        expect(fScope.isBusy).toBeTruthy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      it('should not close form if error', function () {
        $httpBackend.when('PUT', '/items/1').respond(400);
        fScope.createOrUpdate();
        expect(fScope.isShown).toBeTruthy();
        $httpBackend.flush();
        expect(fScope.isShown).toBeTruthy();
      });
   
    });

  });

  describe('ShowFormCtrl', function () {
    
    var fScope, callbacks;
    beforeEach(function () {
      $httpBackend.when('GET', '/items').respond([{ id: 1 }]);
      callbacks = crud(scope, resource);
      fScope = scope.$new();
      $controller('ShowFormCtrl', { $scope: fScope });
    });

    it('should set mode to NewOrEdit', function () {
      fScope.edit();
      expect(fScope.mode).toBe('NewOrEdit');
    });

    it('should open form', function () {
      fScope.isShown = false;
      fScope.delete();
      expect(fScope.isShown).toBeTruthy();
    });

    it('should empty errors', function () {
      fScope.errors = { foo: 'Bar' };
      fScope.delete();
      expect(fScope.errors).toBeUndefined();
    });

    // iit('should call beforeEdit callback', function () {
    //   var t = false;
    //   callbacks.beforeEdit = function () {
    //     t = true;
    //   };
    //   scope.edit();
    //   expect(t).toBeTruthy();
    // });

  });

  xdescribe('DelFormCtrl', function () {
    
    it('should close the form if cancel', function () {
      fScope.cancel();
      expect(fScope.isShown).toBeFalsy();
    });

    it('should empty mode on source scope', function () {
      fScope.cancel();
      expect(fScope.sScope.mode).toBeNull();
    });

    describe('destroy', function () {
    
      var fScope,
        callbacks;
    
      beforeEach(function () {
        $httpBackend.when('GET', '/items').respond([{ id: 1}, { id: 2}]);
        callbacks = crud(scope, resource);
        $httpBackend.flush();
        fScope = scope.$new();
        $controller('FormCtrl', { $scope: fScope });
        fScope.isShown = true;
        fScope.model = scope.modelsList[0];
        // scope.model = scope.modelsList[0];
      });

      it('should empty errors', function () {
        fScope.errors = 'test';
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        expect(fScope.errors).toBeUndefined();
      });

      it('should manage isBusy', function () {
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        expect(fScope.isBusy).toBeTruthy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      it('should destroy data', function () {
        fScope.model = { id: 5 };
        $httpBackend.expect('DELETE', '/items/5').respond();
        fScope.destroy();      
      });

      it('should close form', function () {
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        $httpBackend.flush();
        expect(fScope.isShown).toBeFalsy();      
      });

      it('should remove model from the list', function () {
        $httpBackend.when('DELETE').respond();
        fScope.destroy();
        $httpBackend.flush();
        expect(scope.modelsList[0].id).toBe(2);
      });

      it('should fill errors', function () {
        var e = { foo: 'Bar' };
        $httpBackend.when('DELETE').respond(400, e);
        fScope.destroy();
        $httpBackend.flush();
        expect(fScope.errors).toBe(e);
      });

      it('should manage isBusy if errors', function () {
        $httpBackend.when('DELETE').respond(400);
        fScope.destroy();
        $httpBackend.flush();
        expect(fScope.isBusy).toBeFalsy();
      });

      it('should not close the form if errors', function () {
        $httpBackend.when('DELETE').respond(400);
        fScope.destroy();
        $httpBackend.flush();
        expect(fScope.isShown).toBeTruthy();
      });

      it('should call afterDestroy callback', function () {
        $httpBackend.when('DELETE').respond(200);
        var t = false;
        callbacks.afterDestroy = function () {
          t = true;
        };
        fScope.destroy();
        $httpBackend.flush();
        expect(t).toBeTruthy();
      });

    });

  });

});