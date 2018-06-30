import RegisterSW from '../../../src/sirko/pipes/register_sw';

describe('RegisterSW', function() {
  describe('.call', function() {
    it('returns a promise which resolves once the service worker is active', function() {
      return RegisterSW.call({}).then((data) => {
        assert.isOk(data.serviceWorker);
        assert.isOk(navigator.serviceWorker.controller);
      });
    });
  });
});
