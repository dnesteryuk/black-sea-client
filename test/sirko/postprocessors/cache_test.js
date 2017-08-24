import assert from 'assert';

import Cache from '../../../src/sirko/postprocessors/cache';
import Storage from '../../../src/sirko/storage';

describe('Cache', function() {
  describe('.process', function() {
    beforeEach(function() {
      this.reqInfo = {
        currentPath: '/project'
      };

      Storage.put('lastPrediction', {path: '/about'});
    });

    afterEach(function() {
      Storage.clear();
    });

    it('caches the prediction made on a previous page', function() {
      Cache.process({}, this.reqInfo);

      assert.equal(Storage.pull('prevPrediction').path, '/about');
    });

    it('caches the current prediction as last one', function() {
      let currentPrediction = {path: '/index'};

      Cache.process(currentPrediction, this.reqInfo);

      assert.equal(Storage.pull('lastPrediction').path, currentPrediction.path);
      assert.equal(Storage.pull('lastPredictionFor'), this.reqInfo.currentPath);
    });
  });
});
