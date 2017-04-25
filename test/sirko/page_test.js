import assert from 'assert';
import helpers from '../helpers';

import Page from '../../src/sirko/page';

describe('Page', function() {
  describe('.appendLink', function() {
    afterEach(function() {
      helpers.removeHint();
    });

    it('appends a link tag into the DOM', function() {
      Page.appendLink('prerender', '/list');

      let link = document.querySelector('link[rel="prerender"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:9876/list');
    });
  });
});
