import assert from 'assert';
import sinon from 'sinon';
import helpers from '../../helpers';

import Prerender from '../../../src/sirko/postprocessors/prerender';

describe('Prerender', function() {
  beforeEach(function() {
    this.info = {
      hint:     'prerender',
      nextPath: '/list'
    };
  });

  afterEach(function() {
    helpers.removeHint();
  });

  describe('.process', function() {
    it('appends a link tag declaring the browser to prerender the given url', function() {
      Prerender.process(this.info);

      let link = document.querySelector('link[rel="prerender"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:9876/list');
    });

    context('there is no prediction', function() {
      beforeEach(function() {
        this.info.nextPath = null;
      });

      it('does not append a link tag', function() {
        Prerender.process(this.info);

        assert.equal(
          document.querySelector('link[rel="prerender"]'),
          null
        );
      });
    });

    context('the prerender hint is not support', function() {
      beforeEach(function() {
        this.info.hint = 'fallback';
      });

      it('does not append a link tag', function() {
        Prerender.process(this.info);

        assert.equal(
          document.querySelector('link[rel="prerender"]'),
          null
        );
      });
    });

    it('returns the given object', function() {
      assert.equal(
        Prerender.process(this.info),
        this.info
      );
    });
  });
});
