import assert from 'assert';
import sinon from 'sinon';

import Sirko from '../src/sirko';

describe('Sirko', function() {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();

    this.xhr.onCreate = function(xhr) { this.request = xhr; }.bind(this);
  });

  afterEach(function() {
    this.xhr.restore();
  });

  describe('.predict', function() {
    it('makes a request to the engine', function() {
      Sirko.predict('https://sirko.io');

      assert(this.request);
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.url, 'https://sirko.io/predict?cur=http%3A%2F%2Flocalhost%3A8080%2Ftest');
    });

    context('the referral url is provided', function() {
      it('includes the referral url', function() {
        Sirko.predict('https://sirko.io', 'http://app.io/index', 'http://app.io/');

        assert.equal(this.request.url, 'https://sirko.io/predict?cur=http%3A%2F%2Flocalhost%3A8080%2Ftest&ref=http%3A%2F%2Fapp.io%2Findex');
      });
    });

    it('appends a link tag declaring the browser to prerender the given url of the next page', function() {
      Sirko.predict('https://sirko.io');

      this.request.respond(200, {}, '/list');

      let link = document.querySelector('link[rel="prerender"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:8080/list');
    });
  });
});
