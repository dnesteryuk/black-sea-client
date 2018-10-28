import RegisterSW from '../../../src/sirko/pipes/register_sw';

describe('RegisterSW', function() {
  describe('.call', function() {
    it('returns a promise which resolves once the service worker is active', async function() {
      let data = await RegisterSW.call({});

      assert.exists(data.serviceWorker);
      assert.exists(navigator.serviceWorker.controller);
    });
  });
});
