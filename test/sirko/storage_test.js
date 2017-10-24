import Storage from '../../src/sirko/storage';

const sessStorage = window.sessionStorage;

describe('Storage', function() {
  afterEach(function() {
    sessStorage.clear();
  });

  context('an object', function() {
    it('works fine with objects', function() {
      let obj = {my: 'object'};

      Storage.put('myObj', obj);

      assert.equal(Storage.pull('myObj').my, 'object');
    });
  });

  context('a primitive value', function() {
    it('works fine with primitive values', function() {
      Storage.put('myStr', 'some value');

      assert.equal(Storage.pull('myStr'), 'some value');
    });
  });

  context('there is no such key', function() {
    it('returns undefined', function() {
      assert.equal(Storage.pull('unknown'), undefined);
    });
  });

  describe('.shift', function() {
    it('shifts a value from one key to another one', function() {
      let val = 'some val';

      sessStorage.setItem('ancestor', val);

      Storage.shift('ancestor', 'inheritor');

      assert.equal(sessStorage.getItem('inheritor'), val);
    });
  });

  describe('.clear', function() {
    it('removes all values from the storage', function() {
      sessStorage.setItem('key1', 'test data');
      sessStorage.setItem('key2', 'another test data');

      Storage.clear();

      assert.equal(sessStorage.getItem('key1'), null);
      assert.equal(sessStorage.getItem('key2'), null);
    });
  });
});
