import Storage from '../storage';

/**
 * Caches the last prediction, so if a user reloads the page,
 * the client won't hit the engine.
 */
const Cache = {
  process: function(resp, reqInfo) {
    Storage.shift('lastPrediction', 'prevPrediction');
    Storage.put('lastPrediction', resp);
    Storage.put('lastPredictionFor', reqInfo.currentPath);

    return resp;
  }
};

export default Cache;
