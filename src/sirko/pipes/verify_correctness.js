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
const VerifyCorrectness = {
  call: function(data) {
    let prevPrediction = Storage.pull('prevPrediction'),
        prediction = data.prediction,
        isPrevCorrect;

    if (!prediction.cached && prevPrediction && prevPrediction.path) {
      isPrevCorrect = prevPrediction.path === data.request.currentPath;
    }

    return [prediction.path, isPrevCorrect];
  }
};

export default VerifyCorrectness;
