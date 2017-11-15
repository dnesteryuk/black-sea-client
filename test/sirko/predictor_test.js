import sinon from 'sinon';
import Predictor from '../../src/sirko/predictor';

describe('Predictor', function() {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();

    this.xhr.onCreate = (xhr) => { this.request = xhr; };

    this.predictor = new Predictor('https://sirko.io');

    this.entry = {
      currentPath: '/',
      assets:      ['/js/main.js']
    };

    this.subbedPrediction = {
      path:   '/list',
      assets: ['/js/form.js']
    };

    this.respond = () => {
      this.request.respond(
        200,
        {},
        JSON.stringify(this.subbedPrediction)
      );
    };
  });

  afterEach(function() {
    this.request = null;
    this.xhr.restore();
  });

  describe('#predict', function() {
    it('makes a request to the engine', function() {
      this.predictor.predict(this.entry);

      assert(this.request);
      assert.equal(this.request.method, 'POST');
      assert.equal(this.request.url, 'https://sirko.io/predict');

      let expectedBody = JSON.stringify({
        current: this.entry.currentPath,
        assets:  this.entry.assets
      });

      assert.equal(
        this.request.requestBody,
        expectedBody
      );
    });

    context('the referrer is present', function() {
      it('includes the referrer', function() {
        this.entry.referrerPath = '/index';

        this.predictor.predict(this.entry);

        let expectedBody = JSON.stringify({
          current:  this.entry.currentPath,
          assets:   this.entry.assets,
          referrer: this.entry.referrerPath
        });

        assert.equal(
          this.request.requestBody,
          expectedBody
        );
      });
    });

    it('resolves the promise once the prediction gets received', function(done) {
      this.predictor.predict(this.entry).then((prediction) => {
        assert.equal(prediction.path, this.subbedPrediction.path);
        assert.equal(prediction.assets[0], this.subbedPrediction.assets[0]);

        done();
      });

      this.respond();
    });
  });
});
