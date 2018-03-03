import CheckCache from '../../../src/sirko/pipes/check_cache';
import Storage from '../../../src/sirko/storage';

describe('CheckCache', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {currentPath: '/'}
      };
    });

    afterEach(function() {
      Storage.clear();
    });

    context('the prediction is already made for the current page', function() {
      beforeEach(function() {
        Storage.put('lastPredictionFor', this.data.request.currentPath);
      });

      it('interrupts execution', function() {
        assert.isFalse(CheckCache.call(this.data));
      });
    });

    context('the prediction is not made for the current page', function() {
      it('does nothing', function() {
        let res = CheckCache.call(this.data);
        assert.equal(res, this.data);
      });
    })
  });
});
