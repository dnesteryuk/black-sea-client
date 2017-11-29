import CleanPath from '../../../src/sirko/pipes/clean_paths';

describe('CleanPath', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {
          domain:     'app.io',
          currentUrl: 'https://app.io/some-path',
          referrer:   'http://app.io:1234/some-referrer'
        }
      };
    });

    it('removes the domain and protocol from the current path and referrer', function() {
      let res = CleanPath.call(this.data);

      assert.equal(res.request.currentPath, '/some-path');
      assert.equal(res.request.referrer, '/some-referrer');
    });
  });
});
