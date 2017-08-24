import Page from './page';
import Predictor from './predictor';
import Processor from './processor';

/**
 * Gathers info (a path and assets) of the current page.
 * The gathered info gets sent to the engine. The engine responds with
 * info about a next page which might be visited by a user on
 * this page. The response contains the path to the page and assets
 * of that page. Thus, once response is received the client prefetches
 * the predicted page and assets.
 */
const Client = {
  predict: function(reqInfo, conf) {
    reqInfo = Processor.preprocess(reqInfo, conf);

    if(!reqInfo) return false;

    let promise;

    // the prediction is received from the cache
    if (reqInfo.prediction) {
      promise = new Promise((resolve) => {
        resolve(reqInfo.prediction);
      });
    }
    else {
      let predictor = new Predictor(conf.engineUrl);

      promise = predictor.predict({
        currentPath:  reqInfo.currentPath,
        referrerPath: reqInfo.referrer,
        assets:       reqInfo.assets
      });
    }

    return promise.then((resp) => {
      let prediction = Processor.postprocess(resp, reqInfo);

      return new Promise((resolve) => {
        resolve([prediction.path, prediction.isPrevCorrect]);
      });
    });
  }
};

export default Client;
