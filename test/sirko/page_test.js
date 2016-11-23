import assert from 'assert';

import Page from '../../src/sirko/page';

describe('Page', function() {
  describe('.appendLink', function() {
    afterEach(function() {
      let link = document.querySelector('link[rel="prerender"]');
      link.parentNode.removeChild(link);
    });

    it('appends a link tag into the DOM', function() {
      Page.appendLink('prerender', '/list');

      let link = document.querySelector('link[rel="prerender"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:9876/list');
    });
  });
});
