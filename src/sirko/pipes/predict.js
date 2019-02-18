import Predictor from '../predictor';

/**
 * Requests the engine to make a prediction for the current page.
 * If a prediction is in the cache, returns it without requesting
 * the engine.
 */
const Predict = {
  call: async function(data, conf) {
    // the prediction is received from the cache
    if (data.prediction) return data;

    let predictor = new Predictor(conf.engineUrl),
        request = data.request;

    let prediction = await predictor.predict({
      currentPath:  request.currentPath,
      referrerPath: request.referrer,
      assets:       request.assets
    });

    data.prediction = prediction;
    return data;
  }
};

export default Predict;
