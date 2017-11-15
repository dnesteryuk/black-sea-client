import WriteCache from '../../../src/sirko/pipes/write_cache';
import Storage from '../../../src/sirko/storage';

describe('WriteCache', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {currentPath: '/project'},
        prediction: {}
      };

      Storage.put('lastPrediction', {path: '/about'});
    });

    afterEach(function() {
      Storage.clear();
    });

    it('caches the prediction made on a previous page', function() {
      WriteCache.call(this.data);

      assert.equal(Storage.pull('prevPrediction').path, '/about');
    });

    it('caches the current prediction as last one', function() {
      let predictedPath = '/index';

      this.data.prediction.path = predictedPath;

      WriteCache.call(this.data);

      assert.equal(Storage.pull('lastPrediction').path, predictedPath);
      assert.equal(Storage.pull('lastPredictionFor'), this.data.request.currentPath);
    });
  });
});
