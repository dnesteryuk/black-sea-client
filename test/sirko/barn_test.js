import Barn from '../../src/sirko/barn';

// cache names
import { prefetchKey, offlineKey } from '../../src/sirko/barn';

/**
 * This test suit uses the setTimeout function which slows the suit down.
 * It is required because there are asyn calls. Methods under testing
 * could return promises, thus, the trick with setTimeout would haven't
 * been necessary, but the lib doesn't need to wait for async calls.
 * Thus, it is better to use the trick rather than change production
 * code to make it more testable. Also, the code would've been more complex.
 */
describe('Barn', function() {
  async function cacheResponse(cacheName) {
    let cache = await caches.open(cacheName);
    return cache.put(this.request, this.response);
  }

  async function assertBody(prom, expectedBody) {
    let resp = await prom;
    assert.isOk(resp);
    let body = await resp.text();
    assert.include(body, expectedBody);
  }

  afterEach(function() {
    return Promise.all([
      caches.delete(prefetchKey),
      caches.delete(offlineKey)
    ]);
  });

  describe('.get', function() {
    context('the requested resource is not cached', function() {
      beforeEach(function() {
        this.request = new Request('/js/form.js');
      });

      it('fetches and returns the response', function() {
        assertBody(Barn.get(this.request), 'dummy-js');
      });
    });

    context('the requested resource is prefetched', function() {
      beforeEach(function() {
        this.request = new Request('/js/some.js');
        this.response = new Response('prefetched resource');

        return cacheResponse.call(this, prefetchKey);
      });

      it('returns the response from the prefetch cache', function() {
        assertBody(Barn.get(this.request), 'prefetched resource');
      });
    });

    context('the resource is cached, the user is offline', function() {
      beforeEach(function() {
        // make something unreal to make the fetch method fail
        this.request = new Request('https://example.test/');
        this.response = new Response('offline resource');

        return cacheResponse.call(this, offlineKey);
      });

      it('returns the response from the offline cache', function() {
        assertBody(Barn.get(this.request), 'offline resource');
      });
    });
  });

  describe('.shift', function() {
    beforeEach(function() {
      this.request = new Request('/js/some.js');
      this.response = new Response('moved resource');

      return cacheResponse.call(this, prefetchKey);
    });

    it('moves prefetched resources to the offline cache', async function() {
      await Barn.shift();

      assertBody(
        caches.match(this.request, {cacheName: offlineKey}),
        'moved resource',
      );
    });

    it('cleans the prefetch cache', async function() {
      await Barn.shift();

      let cache = await caches.open(prefetchKey),
          keys = await cache.keys();

      assert.equal(keys.length, 0);
    });
  });

  describe('.prefetch', function() {
    beforeEach(function() {
      this.pages = [{path: 'stub.html'}];
      this.assets = ['js/form.js'];
    });

    it('prefetches pages', function(done) {
      Barn.prefetch(this.pages, this.assets);

      setTimeout(() => {
        assertBody(
          caches.match(this.pages[0].path, {cacheName: prefetchKey}),
          'dummy-html'
        );

        done();
      }, 200);
    });

    it('prefetches assets', function(done) {
      Barn.prefetch(this.pages, this.assets);

      setTimeout(() => {
        assertBody(
          caches.match(this.assets[0], {cacheName: prefetchKey}),
          'dummy-js'
        );

        done();
      }, 200);
    });
  });

  describe('.cleanPrefetch', function() {
    beforeEach(function() {
      this.request = new Request('/form.js');
      this.response = new Response('some js');

      return cacheResponse.call(this, prefetchKey);
    });

    it('removes the prefetch cache', async function() {
      await Barn.cleanPrefetch();

      let existance = await caches.has(prefetchKey)
      assert.isFalse(existance);
    });
  });
});
