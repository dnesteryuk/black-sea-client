import sinon from 'sinon';
import Predict from '../../../src/sirko/pipes/predict';

describe('Predict', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {currentPath: '/'}
      };

      this.prediction = {some: 'prediction'};

      this.conf = {
        engineUrl: 'https://sirko.io'
      };
    });

    context('there is a prediction in the cache', function() {
      beforeEach(function() {
        this.data.prediction = this.prediction;
      });

      it('returns the existing prediction', function() {
        let res = Predict.call(this.data);
        assert.equal(this.data.prediction, this.prediction);
      });
    });

    context('there is no prediction in the cache', function() {
      beforeEach(function() {
        this.server = sinon.fakeServer.create({autoRespond: true});
        this.server.respondWith(
          /sirko\.io/,
          [200, {}, JSON.stringify(this.prediction)]
        );
      });

      afterEach(function() {
        this.server.restore();
      });

      it('requests the engine to make a prediction', function() {
        return Predict.call(this.data, this.conf).then((res) => {
          assert.equal(res.prediction.some, this.prediction.some);
        });
      });
    });
  });
});
