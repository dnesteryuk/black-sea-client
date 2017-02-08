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
        this.predictor.predict('/', '/index');

        assert.equal(
          this.request.url,
          'https://sirko.io/predict?' +
          'cur=%2F&' +
          'ref=%2Findex'
        );
      });
    });

    it('resolves the promise once the prediction get received', function(done) {
      this.predictor.predict('/').then(val => {
        assert.equal(val, '/list');
        done();
      });

      this.request.respond(200, {}, '/list');
    });

    it('keeps the previous prediction', function(done) {
      let prevPrediction = '/reports';

      sessionStorage.setItem('lastPrediction', prevPrediction);

      this.predictor.predict('/').then(val => {
        assert.equal(this.predictor.prevPrediction(), prevPrediction);
        done();
      });

      this.request.respond(200, {}, '/list');
    });

    context('the page gets reloaded', function() {
      beforeEach(function() {
        sessionStorage.setItem('lastPrediction', '/reports');
        sessionStorage.setItem('lastPredictionFor', '/');
      });

      it('does not make a request to the engine', function() {
        this.predictor.predict('/');

        assert.equal(this.request.url, null);
      });

      it('resolves the promise with the cached prediction for this page', function() {
        return this.predictor.predict('/').then((prediction) => {
          assert.equal(prediction, '/reports');
        });
      });
    });
  });
});
