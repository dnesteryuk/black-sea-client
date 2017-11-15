import ReadCache from '../../../src/sirko/pipes/read_cache';
import Storage from '../../../src/sirko/storage';

describe('ReadCache', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {currentPath: '/'}
      };
    });

    afterEach(function() {
      Storage.clear();
    });

    context('there is a cached prediction for the current page', function() {
      beforeEach(function() {
        Storage.put('lastPrediction', {path: '/about'});
        Storage.put('lastPredictionFor', this.data.request.currentPath);
      });

      it('adds the prediction to the returned data', function() {
        let res = ReadCache.call(this.data);

        assert.equal(res.prediction.path, '/about');
        assert.equal(res.prediction.cached, true);
      });
    });

    context('there is no prediction in the cache', function() {
      it('does nothing', function() {
        let res = ReadCache.call(this.data);

        assert.equal(res.prediction, undefined);
      });
    })
  });
});
