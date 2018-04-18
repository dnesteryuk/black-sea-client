import CleanPath from '../../../src/sirko/pipes/clean_paths';

describe('CleanPath', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {
          origin:     'https://app.io',
          currentUrl: 'https://app.io/current-path/sub-path/page.html',
          referrer:   'https://app.io/referrer-path/sub-path/page.html'
        }
      };
    });

    it('removes the domain and protocol from the current path and referrer', function() {
      let res = CleanPath.call(this.data);

      assert.equal(res.request.currentPath, '/current-path/sub-path/page.html');
      assert.equal(res.request.referrer, '/referrer-path/sub-path/page.html');
    });
  });
});
