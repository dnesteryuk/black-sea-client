import assert from 'assert';

import PathCleaner from '../../../src/sirko/preprocessors/path_cleaner';

describe('PathCleaner', function() {
  describe('.process', function() {
    beforeEach(function() {
      this.reqInfo = {
        domain:      'app.io',
        currentPath: 'https://app.io/some-path',
        referrer:    'http://app.io:1234/some-referrer'
      };
    });

    it('removes the domain and protocol from the current path and referrer', function() {
      let res = PathCleaner.process(this.reqInfo);

      assert.equal(res.currentPath, '/some-path');
      assert.equal(res.referrer, '/some-referrer');
    });
  });
});
