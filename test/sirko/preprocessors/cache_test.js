import Cache from '../../../src/sirko/preprocessors/cache';
import Storage from '../../../src/sirko/storage';

describe('Cache', function() {
  describe('.process', function() {
    beforeEach(function() {
      this.reqInfo = {currentPath: '/'};
    });

    afterEach(function() {
      Storage.clear();
    });

    context('prediction for the current page is in the cache', function() {
      beforeEach(function() {
        Storage.put('lastPrediction', {path: '/about'});
        Storage.put('lastPredictionFor', this.reqInfo.currentPath);
      });

      it('adds the prediction to the request info', function() {
        let reqInfo = Cache.process(this.reqInfo);

        assert.equal(reqInfo.prediction.path, '/about');
        assert.equal(reqInfo.prediction.cached, true);
      });
    });

    context('there is no prediction in the cache', function() {
      it('does nothing', function() {
        let reqInfo = Cache.process(this.reqInfo);

        assert.equal(reqInfo.prediction, undefined);
      });
    })
  });
});
