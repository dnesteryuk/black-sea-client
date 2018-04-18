import Traffic from '../../src/sirko/traffic';

describe('Traffic', function() {
  afterEach(function() {
    Traffic.clean();
  });

  describe('.modifiedState', function() {
    beforeEach(function() {
      this.origin = 'http://example.org';
      this.referrer = 'http://example.org/a';
      this.current  = 'http://example.org/d';
    });

    context('there is a request modifying data between the referrer and current page', function() {
      it('returns true', function() {
        Traffic.add({
          url:    this.referrer,
          method: 'GET'
        });

        Traffic.add({
          url:    'http://example.org/b',
          method: 'POST'
        });

        Traffic.add({
          url:    this.current,
          method: 'GET'
        });

        assert.equal(
          Traffic.modifiedState(this.referrer, this.current, this.origin),
          true
        );
      });

      context('the request is not related to the given origin', function() {
        beforeEach(function() {
          Traffic.add({
            url:    this.referrer,
            method: 'GET'
          });

          Traffic.add({
            url:    'http://google.com/b',
            method: 'POST'
          });

          Traffic.add({
            url:    this.current,
            method: 'GET'
          });
        });

        it('returns false', function() {
          assert.equal(
            Traffic.modifiedState(this.referrer, this.current, this.origin),
            false
          );
        });
      });

      context('the url of the request is in the white-list', function() {
        beforeEach(function() {
          this.urlModifingData = 'http://example.org/b';

          Traffic.add({
            url:    this.referrer,
            method: 'GET'
          });

          Traffic.add({
            url:    this.urlModifingData,
            method: 'POST'
          });

          Traffic.add({
            url:    this.current,
            method: 'GET'
          });
        });

        it('returns false', function() {
          let res = Traffic.modifiedState(
            this.referrer,
            this.current,
            this.origin,
            [this.urlModifingData]
          );

          assert.equal(res, false);
        });
      });
    });

    context('the current page is loaded via a request modifying data', function() {
      beforeEach(function() {
        Traffic.add({
          url:    this.referrer,
          method: 'GET'
        });

        Traffic.add({
          url:    this.current,
          method: 'PUT'
        });
      });

      it('returns true', function() {
        assert.equal(
          Traffic.modifiedState(this.referrer, this.current, this.origin),
          true
        );
      });
    });

    context('the current page is loaded several times', function() {
      beforeEach(function() {
        // a user visited the referrer page
        Traffic.add({
          url:    this.referrer,
          method: 'GET'
        });

        // a next page is prefetched
        Traffic.add({
          url:    this.current,
          method: 'GET'
        });

        // data got modified
        Traffic.add({
          url:    this.referrer,
          method: 'POST'
        });

        // the user moved to the predicted page
        Traffic.add({
          url:    this.current,
          method: 'GET'
        });
      });

      it('returns true', function() {
        assert.equal(
          Traffic.modifiedState(this.referrer, this.current, this.origin),
          true
        );
      });
    });

    context('the referrer cannot be found among records', function() {
      beforeEach(function() {
        Traffic.add({
          url:    this.current,
          method: 'GET'
        });
      });

      it('returns true', function() {
        assert.equal(
          Traffic.modifiedState(this.referrer, this.current, this.origin),
          true
        );
      });
    });
  });

  describe('.removeAllBefore', function() {
    beforeEach(function() {
      this.url = 'http://example.org/c';

      Traffic.add({
        url: 'http://example.org/a'
      });

      Traffic.add({
        url: 'http://example.org/b'
      });

      Traffic.add({
        url: this.url
      });

      Traffic.add({
        url: 'http://example.org/d'
      });
    });

    it('removes all records which were added before the given url', function() {
      Traffic.removeAllBefore(this.url);

      assert.equal(Traffic.records.length, 2);
      assert.equal(Traffic.records[0].url, this.url);
    });

    context('the give url is not in the list', function() {
      it('does not remove any record', function() {
        Traffic.removeAllBefore('http://example.org/z');

        assert.equal(Traffic.records.length, 4);
      });
    });

    context('there are a few records with the same url', function() {
      beforeEach(function() {
        Traffic.add({
          url: this.url
        });
      });

      it('keeps only the last record', function() {
        Traffic.removeAllBefore(this.url);

        assert.equal(Traffic.records.length, 1);
        assert.equal(Traffic.records[0].url, this.url);
      });
    });
  });
});
