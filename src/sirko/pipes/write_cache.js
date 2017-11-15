import Storage from '../storage';

/**
 * Caches the last prediction, so if a user reloads the page,
 * the client won't hit the engine.
 */
const WriteCache = {
  call: function(data) {
    Storage.shift('lastPrediction', 'prevPrediction');
    Storage.put('lastPrediction', data.prediction);
    Storage.put('lastPredictionFor', data.request.currentPath);

    return data;
  }
};

export default WriteCache;
