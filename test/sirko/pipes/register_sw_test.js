import RegisterSW from '../../../src/sirko/pipes/register_sw';

const cacheName = 'sirko-pages';

describe('RegisterSW', function() {
  describe('.call', function() {
    beforeEach(function(done) {
      // add something to the cache
      caches.open(cacheName)
        .then(function(cache) {
          cache.put('/index', new Response());

          done();
        });
    });

    it('removes previously cached pages', function(done) {
      RegisterSW.call({});

      caches.has(cacheName).then(function(existence) {
        assert.equal(existence, false);

        done();
      });
    });
  });
});
