import Storage from '../storage';

/**
 * Checks whether the current page has already got a prediction,
 * thus the prediction can be returned from the cache.
 * The client caches only the last prediction to not hit the engine
 * again when a user refreshes the page.
 */
const Cache = {
  process: function(reqInfo) {
    if (Storage.pull('lastPredictionFor') === reqInfo.currentPath) {
      reqInfo.prediction = Storage.pull('lastPrediction');
      reqInfo.prediction.cached = true;
    }

    return reqInfo;
  }
}

export default Cache;
