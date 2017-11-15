import PrefetchAssets from '../../../src/sirko/pipes/prefetch_assets';
import Helpers from '../../helpers';

describe('PrefetchAssets', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.predictedAssets = ['css/main.css', 'js/main.js'];
      this.origin = document.location.origin;
      this.data = {
        request:    {assets: []},
        prediction: {assets: this.predictedAssets}
      };
    });

    afterEach(function() {
      Helpers.removeHints('prefetch');
    });

    it('adds link tags to prefetch assets', function() {
      PrefetchAssets.call(this.data);

      let link = document.querySelectorAll('link[rel="prefetch"]');

      this.predictedAssets.forEach(function(file, index) {
        assert.equal(link[index].href, `${origin}/${file}`);
      });
    });

    context('there are assets which are loaded for the current page', function() {
      beforeEach(function() {
        this.data.request.assets = ['js/main.js'];
      });

      it('does not add hints for them since they are already in the cache', function() {
        PrefetchAssets.call(this.data);

        assert.ok(document.querySelector('link[href="css/main.css"]'),
          'the main.css got the prefetch hint');

        assert.equal(document.querySelector('link[href="js/main.js"]'), null,
          'the main.js asset did not get the prefetch hint');
      })
    });

    context('no prediction', function() {
      it('does not fail', function() {
        PrefetchAssets.call({prediction: {}});
      });
    });
  });
});
