import RegisterSW from '../../../src/sirko/pipes/register_sw';

describe('RegisterSW', function() {
  describe('.call', function() {
    it('returns a promise which resolves once the service worker is active', function() {
      RegisterSW.call({}).then((data) => {
        assert.isObject(data.serviceWorker);
        assert.isObject(navigator.serviceWorker.controller);
      });
    });
  });
});
