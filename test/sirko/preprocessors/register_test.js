import Register from '../../../src/sirko/preprocessors/register';

const cacheName = 'sirko-pages';

describe('Register', function() {
  describe('.process', function() {
    beforeEach(function(done) {
      // add something to the cache
      caches.open(cacheName)
        .then(function(cache) {
          cache.put('/index', new Response());

          done();
        });
    });

    it('removes previously cached pages', function(done) {
      Register.process({});

      caches.has(cacheName).then(function(existence) {
        assert.equal(existence, false);

        done();
      });
    });
  });
});
