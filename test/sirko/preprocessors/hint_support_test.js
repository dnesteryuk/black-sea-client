import assert from 'assert';
import helpers from '../../helpers';

import HintSupport from '../../../src/sirko/preprocessors/hint_support';

describe('HintSupport', function() {
  describe('.process', function() {
    it('sets the prerender/fallback hint as a supported one', function() {
      let res = HintSupport.process({});
      let hint = helpers.isChrome() ? 'prerender' : 'fallback';

      assert.equal(res.hint, hint);
    });
  });
});
