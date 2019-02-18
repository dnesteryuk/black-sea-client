import Predictor from '../../src/sirko/predictor';
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

    return helpers.registerHttpStubs();
  });

  describe('#predict', function() {
    it('makes a request to the engine', async function() {
      await this.predictor.predict(this.entry);
      let req = await helpers.latestRequest();

      assert.isOk(req);
      assert.equal(req.method, 'POST');
      assert.equal(req.url, this.engineUrl);

      let expectedBody = {
        current: this.entry.currentPath,
        assets:  this.entry.assets
      };

      assert.deepEqual(req.body, expectedBody);
    });

    context('the referrer is present', function() {
      it('includes the referrer', async function() {
        this.entry.referrerPath = '/index';

        await this.predictor.predict(this.entry)
        let req = await helpers.latestRequest();

        let expectedBody = {
          current:  this.entry.currentPath,
          assets:   this.entry.assets,
          referrer: this.entry.referrerPath
        };

        assert.deepEqual(req.body, expectedBody);
      });
    });

    it('resolves the promise once the prediction gets received', async function() {
      let prediction = await this.predictor.predict(this.entry);
      assert.deepEqual(prediction, predictedList);
    });
  });
});
