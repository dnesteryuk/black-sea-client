import Page from './page';
import Predictor from './predictor';
import MobilePreprocessor from './preprocessors/mobile';
import ReferrerPreprocessor from './preprocessors/referrer';
import PathCleanerPreprocessor from './preprocessors/path_cleaner';

/**
 * This object tracks the current page visited by a particular user
 * and adds a hint for the browser about a next page to be visited by the user.
 */
const Client = {
  preprocessors: [
    MobilePreprocessor,
    ReferrerPreprocessor,
    PathCleanerPreprocessor
  ],

  _listeners: [],

  predict: function(engineUrl, reqInfo) {
    reqInfo = this._preprocess(reqInfo);

    if(!reqInfo) return false;

    let predictor = new Predictor(engineUrl);

    // don't try to prerender a page if the current page
    // isn't visible yet. Otherwise, it leads to prerendering
    // a chain of pages for one request.
    let promise = Page.onceVisible().then(() => {
      return predictor.predict(
        reqInfo.currentPath,
        reqInfo.referrer
      );
    }).then((prediction) => {
      this._appendLink(prediction);

      let isPrevCorrect;

      if (predictor.prevPrediction()) {
        // check either the previous prediction is correct or not.
        // This info is useful to track accuracy of predictions.
        isPrevCorrect = predictor.prevPrediction() == reqInfo.currentPath;
      }

      return new Promise((resolve) => {
        resolve([prediction, isPrevCorrect]);
      });
    });

    return promise;
  },

  /**
   * Runs preprocessors which may change the request info or
   * tell the client to not make prediction by returning false or null.
   */
  _preprocess: function(reqInfo) {
    for (let processor of this.preprocessors) {
      reqInfo = processor.process(reqInfo);
      if (!reqInfo) return false;
    }

    return reqInfo;
  },

  _appendLink(nextPath) {
    if (!nextPath) return;

    Page.appendLink('prerender', nextPath);
  }
};

export default Client;
