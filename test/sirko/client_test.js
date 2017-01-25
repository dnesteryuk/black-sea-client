import assert from 'assert';
import sinon from 'sinon';

import Client from '../../src/sirko/client';

describe('Client', function() {
  beforeEach(function() {
    this.requestInfo = {
      agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) ' +
        'Gecko/20100101 Firefox/50.0',
      currentUrl: 'http://app.io'
    };

    this.xhr = sinon.useFakeXMLHttpRequest();

    this.xhr.onCreate = function(xhr) { this.request = xhr; }.bind(this);
  });

  afterEach(function() {
    this.request = null;
    this.xhr.restore();

    let link = document.querySelector('link[rel="prerender"]');

    if (link) link.parentNode.removeChild(link);
  });

  describe('.predict', function() {
    it('makes a request to the engine', function() {
      Client.predict('https://sirko.io', this.requestInfo);

      assert(this.request);
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.url, 'https://sirko.io/predict?cur=http%3A%2F%2Fapp.io');
    });

    context('the referrer is present', function() {
      beforeEach(function() {
        this.requestInfo.referrer = 'http://app.io/index';
      });

      it('includes the referrer', function() {
        Client.predict('https://sirko.io', this.requestInfo);

        assert.equal(
          this.request.url,
          'https://sirko.io/predict?' +
          'cur=http%3A%2F%2Fapp.io&' +
          'ref=http%3A%2F%2Fapp.io%2Findex'
        );
      });
    });

    it('appends a link tag declaring the browser to prerender the given url of the next page', function() {
      Client.predict('https://sirko.io', this.requestInfo);

      this.request.respond(200, {}, '/list');

      let link = document.querySelector('link[rel="prerender"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:9876/list');
    });

    context('the engine does not make prediction', function() {
      it('does not append a link tag', function() {
        Client.predict('https://sirko.io', this.requestInfo);

        this.request.respond(200, {}, '');

        let link = document.querySelector('link[rel="prerender"]');

        assert.equal(link, null);
      });
    });

    context('it is a mobile browser', function() {
      beforeEach(function() {
        this.requestInfo.agent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 4 Build/LMY48T)' +
          ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36';
      });

      it('does not make any request', function() {
        Client.predict('https://sirko.io', this.requestInfo);

        assert.equal(this.request, null);
      });
    });
  });
});
