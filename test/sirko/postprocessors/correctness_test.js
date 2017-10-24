import Correctness from '../../../src/sirko/postprocessors/correctness';
import Storage from '../../../src/sirko/storage';

describe('Correctness', function() {
  describe('.process', function() {
    beforeEach(function() {
      Storage.put('prevPrediction', {path: '/index'});
    });

    afterEach(function() {
      Storage.clear();
    });

    context('the current prediction is received from the cache', function() {
      it('keeps the undefined value', function() {
        let resp = Correctness.process({cached: true}, {});

        assert.equal(resp.isPrevCorrect, undefined);
      });
    });

    context('the previous prediction foresaw the current page', function() {
      it('sets true', function() {
        let resp = Correctness.process({}, {currentPath: '/index'});

        assert.equal(resp.isPrevCorrect, true);
      });
    });

    context('the previous prediction did not foresee the current page', function() {
      it('sets false', function() {
        let resp = Correctness.process({}, {currentPath: '/about'});

        assert.equal(resp.isPrevCorrect, false);
      });
    });
  });
});
