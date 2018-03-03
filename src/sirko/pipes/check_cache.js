import Storage from '../storage';

/**
 * Checks whether the current page has already got a prediction.
 * If so, predicted resources are already in the cache, there is no
 * reason to request the prediction again.
 */
const CheckCache = {
  call: function(data) {
    if (Storage.pull('lastPredictionFor') === data.request.currentPath)
      return false;

    return data;
  }
}

export default CheckCache;
