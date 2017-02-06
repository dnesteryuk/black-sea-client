import Page from './page';
import Predictor from './predictor';
import MobilePreprocessor from './preprocessors/mobile';
import ReferrerPreprocessor from './preprocessors/referrer';

/**
 * This object tracks the current page visited by a particular user
 * and adds a hint for the browser about a next page to be visited by the user.
 */
const Client = {
  preprocessors: [
    MobilePreprocessor,
    ReferrerPreprocessor
  ],

  predict: function(engineUrl, requestInfo) {
    requestInfo = this._preprocess(requestInfo);

    if(!requestInfo) return false;

    let predictor = new Predictor(engineUrl);

    // don't try to prerender a page if the current page
    // is prerendered. Otherwise, it leads to prerendering
    // a chain of pages for one request.
    Page.onceVisible(
      () => predictor.predict(requestInfo.currentUrl, requestInfo.referrer)
    );
  },

  /**
   * Runs preprocessors which may change the request info or
   * tell the client to not make prediction by returning false or null.
   */
  _preprocess: function(requestInfo) {
    for (let processor of this.preprocessors) {
      requestInfo = processor.process(requestInfo);
      if (!requestInfo) return false;
    }

    return requestInfo;
  }
};

export default Client;
