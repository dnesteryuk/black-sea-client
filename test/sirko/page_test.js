import assert from 'assert';
import helpers from '../helpers';

import Page from '../../src/sirko/page';

describe('Page', function() {
  describe('.appendLink', function() {
    afterEach(function() {
      helpers.removeHints('prefetch');
    });

    it('appends a link tag into the DOM', function() {
      Page.appendLink('prefetch', '/js/app.js');

      let link = document.querySelector('link[rel="prefetch"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:9876/js/app.js');
    });
  });
});
