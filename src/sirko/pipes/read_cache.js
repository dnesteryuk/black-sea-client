import Storage from '../storage';

/**
 * Checks whether the current page has already got a prediction,
 * thus the prediction can be returned from the cache.
 * The client caches only the last prediction to not hit the engine
 * again when a user refreshes the page.
 */
const ReadCache = {
  call: function(data) {
    if (Storage.pull('lastPredictionFor') === data.request.currentPath) {
      data.prediction = Storage.pull('lastPrediction');
      data.prediction.cached = true;
    }

    return data;
  }
}

export default ReadCache;
