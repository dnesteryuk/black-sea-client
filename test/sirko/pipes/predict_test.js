import Predict from '../../../src/sirko/pipes/predict';
import RegisterSW from '../../../src/sirko/pipes/register_sw';
import { predictedList } from '../../support/prediction_stub';

describe('Predict', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {currentPath: '/'}
      };

      this.conf = {
        engineUrl: 'https://sirko.io/predict'
      };

      return RegisterSW.call({});
    });

    context('there is a prediction in the cache', function() {
      beforeEach(function() {
        this.prediction = 'some prediction';
        this.data.prediction = this.prediction;
      });

      it('returns the existing prediction', async function() {
        let res = await Predict.call(this.data, this.conf);
        assert.equal(res.prediction, this.prediction);
      });
    });

    context('there is no prediction in the cache', function() {
      it('requests the engine to make a prediction', async function() {
        let res = await Predict.call(this.data, this.conf);
        assert.deepEqual(res.prediction, predictedList);
      });
    });
  });
});
