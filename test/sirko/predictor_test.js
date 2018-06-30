import Predictor from '../../src/sirko/predictor';
import RegisterSW from '../../src/sirko/pipes/register_sw';
import helpers from '../helpers';
import { predictedList } from '../support/prediction_stub';

describe('Predictor', function() {
  beforeEach(function() {
    this.engineUrl = 'https://sirko.io/predict';
    this.predictor = new Predictor(this.engineUrl);

    this.entry = {
      currentPath: '/',
      assets:      ['/js/main.js']
    };

    this.data = {};

    this.getLatestRequest = () => {
      return helpers.sendMsgToSWStub(
        'latestRequest',
        this.data.serviceWorker
      );
    };

    return RegisterSW.call(this.data);
  });

  describe('#predict', function(done) {
    it('makes a request to the engine', function() {
      return this.predictor.predict(this.entry)
        .then(this.getLatestRequest)
        .then((latestRequest) => {
          assert.isOk(latestRequest);
          assert.equal(latestRequest.method, 'POST');
          assert.equal(latestRequest.url, this.engineUrl);

          let expectedBody = {
            current: this.entry.currentPath,
            assets:  this.entry.assets
          };

          assert.deepEqual(latestRequest.body, expectedBody);
        });
    });

    context('the referrer is present', function() {
      it('includes the referrer', function() {
        this.entry.referrerPath = '/index';

        return this.predictor.predict(this.entry)
          .then(this.getLatestRequest)
          .then((latestRequest) => {
            let expectedBody = {
              current:  this.entry.currentPath,
              assets:   this.entry.assets,
              referrer: this.entry.referrerPath
            };

            assert.deepEqual(latestRequest.body, expectedBody);
          });
      });
    });

    it('resolves the promise once the prediction gets received', function() {
      return this.predictor.predict(this.entry)
        .then((prediction) => {
          assert.deepEqual(prediction, predictedList);
        });
    });
  });
});
