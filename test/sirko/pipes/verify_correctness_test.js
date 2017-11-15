import VerifyCorrectness from '../../../src/sirko/pipes/verify_correctness';
import Storage from '../../../src/sirko/storage';

describe('VerifyCorrectness', function() {
  describe('.call', function() {
    beforeEach(function() {
      Storage.put('prevPrediction', {path: '/index'});

      this.data = {
        request: {},
        prediction: {cached: true}
      };
    });

    afterEach(function() {
      Storage.clear();
    });

    context('the current prediction is received from the cache', function() {
      it('keeps the undefined value', function() {
        let [_, isPrevCorrect] = VerifyCorrectness.call(this.data);

        assert.equal(isPrevCorrect, undefined);
      });
    });

    context('the was no previous prediction', function() {
      beforeEach(function() {
        Storage.put('prevPrediction', {});
      });

      it('keeps the undefined value', function() {
        let [_, isPrevCorrect] = VerifyCorrectness.call(this.data);

        assert.equal(isPrevCorrect, undefined);
      });
    });

    context('the previous prediction foresaw the current page', function() {
      beforeEach(function() {
        this.data.request.currentPath = '/index';
        this.data.prediction.cached = undefined;
      });

      it('sets true', function() {
        let [_, isPrevCorrect] = VerifyCorrectness.call(this.data);
        assert.equal(isPrevCorrect, true);
      });
    });

    context('the previous prediction did not foresee the current page', function() {
      beforeEach(function() {
        this.data.request.currentPath = '/about';
        this.data.prediction.cached = undefined;
      });

      it('sets false', function() {
        let [_, isPrevCorrect] = VerifyCorrectness.call(this.data);

        assert.equal(isPrevCorrect, false);
      });
    });
  });
});
