import assert from 'assert';

import Assets from '../../../src/sirko/postprocessors/assets';
import Helpers from '../../helpers';

describe('Assets', function() {
  describe('.process', function() {
    beforeEach(function() {
      this.predictedAssets = ['css/main.css', 'js/main.js'];
      this.origin = document.location.origin;
    });

    afterEach(function() {
      Helpers.removeHints('prefetch');
    });

    it('adds link tags to prefetch assets', function() {
      Assets.process({assets: this.predictedAssets}, {assets: []});

      let link = document.querySelectorAll('link[rel="prefetch"]');

      this.predictedAssets.forEach(function(file, index) {
        assert.equal(link[index].href, `${origin}/${file}`);
      });
    });

    context('there are assets which are loaded for the current page', function() {
      it('does not add hints for them since they are already in the cache', function() {
        Assets.process({assets: this.predictedAssets}, {assets: ['js/main.js']});

        assert.ok(document.querySelector('link[href="css/main.css"]'),
          'the main.css got the prefetch hint');

        assert.equal(document.querySelector('link[href="js/main.js"]'), null,
          'the main.js asset did not get the prefetch hint');
      })
    });

    context('no prediction', function() {
      it('does not fail', function() {
        Assets.process({});
      });
    });
  });
});
