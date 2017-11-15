import Predictor from '../predictor';

/**
 * Requests the engine to make a prediction for the current page.
 * If a prediction is in the cache, returns it without requesting
 * the engine.
 */
const Predict = {
  call: function(data, conf) {
    // the prediction is received from the cache
    if (data.prediction) {
      return data;
    }
    else {
      let predictor = new Predictor(conf.engineUrl),
          request = data.request;

      return predictor.predict({
        currentPath:  request.currentPath,
        referrerPath: request.referrer,
        assets:       request.assets
      }).then((prediction) => {
        data.prediction = prediction;

        return Promise.resolve(data);
      });
    }
  }
};

export default Predict;
