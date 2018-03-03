import Storage from '../storage';

/**
 * Checks whether a previous prediction (the prediction for the previous page)
 * was correct. This info is useful to track accuracy of predictions.
 */
const VerifyCorrectness = {
  call: function(data) {
    let prevPrediction = Storage.pull('prevPrediction'),
        prediction = data.prediction,
        isPrevCorrect;

    if (prevPrediction && prevPrediction.pages.length) {
      isPrevCorrect = prevPrediction.pages.findIndex((page) => {
        return page.path === data.request.currentPath;
      }) > -1;
    }

    return [prediction.pages, isPrevCorrect];
  }
};

export default VerifyCorrectness;
