import Storage from '../storage';

/**
 * Checks whether a previous prediction (the prediction for the previous page)
 * was correct. This info is useful to track accuracy of predictions.
 *
 * If the current prediction is received from the cache, the user's
 * callback shouldn't track it again, the event was already tracked.
 * Performing this check, we make sure an external tracking service integrated
 * by a customer receives only information about unique predictions.
 */
const Correctness = {
  process: function(resp, reqInfo) {
    let prevPrediction = Storage.pull('prevPrediction');

    if (!resp.cached && prevPrediction) {
      resp.isPrevCorrect = prevPrediction.path === reqInfo.currentPath;
    }

    return resp;
  }
};

export default Correctness;
