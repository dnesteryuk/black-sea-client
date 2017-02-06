import assert from 'assert';
import sinon from 'sinon';

import Predictor from '../../src/sirko/predictor';

describe('Predictor', function() {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();

    this.xhr.onCreate = function(xhr) { this.request = xhr; }.bind(this);

    this.predictor = new Predictor('https://sirko.io');
  });

  afterEach(function() {
    this.request = null;
    this.xhr.restore();

    sessionStorage.clear();

    let link = document.querySelector('link[rel="prerender"]');

    if (link) link.parentNode.removeChild(link);
  });

  describe('#predict', function() {
    it('makes a request to the engine', function() {
      this.predictor.predict('http://app.io');

      assert(this.request);
      assert.equal(this.request.method, 'GET');
      assert.equal(this.request.url, 'https://sirko.io/predict?cur=http%3A%2F%2Fapp.io');
    });

    context('the referrer is present', function() {
      it('includes the referrer', function() {
        this.predictor.predict('http://app.io', 'http://app.io/index');

        assert.equal(
          this.request.url,
          'https://sirko.io/predict?' +
          'cur=http%3A%2F%2Fapp.io&' +
          'ref=http%3A%2F%2Fapp.io%2Findex'
        );
      });
    });

    it('appends a link tag declaring the browser to prerender the given url', function() {
      this.predictor.predict('http://app.io');

      this.request.respond(200, {}, '/list');

      let link = document.querySelector('link[rel="prerender"]');

      assert(link);
      assert.equal(link.href, 'http://localhost:9876/list');
    });

    context('the engine does not make prediction', function() {
      it('does not append a link tag', function() {
        this.predictor.predict('http://app.io');

        this.request.respond(200, {}, '');

        let link = document.querySelector('link[rel="prerender"]');

        assert.equal(link, null);
      });
    });

    context('the page gets reloaded', function() {
      beforeEach(function() {
        sessionStorage.setItem('lastPrediction', '/reports');
        sessionStorage.setItem('lastPredictionFor', 'http://app.io');
      });

      it('does not make a request to the engine', function() {
        this.predictor.predict('http://app.io');

        assert.equal(this.request.url, null);
      });

      it('appends a link tag declaring the browser to prerender the stored url', function() {
        this.predictor.predict('http://app.io');

        let link = document.querySelector('link[rel="prerender"]');

        assert(link);
        assert.equal(link.href, 'http://localhost:9876/reports');
      });
    });
  });
});
