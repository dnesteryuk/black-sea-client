import Page from './page';
import MobilePreprocessor from './preprocessors/mobile';
import ReferrerPreprocessor from './preprocessors/referrer';

const preprocessors = [
  MobilePreprocessor,
  ReferrerPreprocessor
];

/**
 * This prototype tracks the current page visited by a particular user
 * and gets a next page to be visited by the user.
 */
class Client {
  constructor(engineUrl) {
    this.engineUrl = engineUrl;
    this.xhr = new XMLHttpRequest();
  }

  predict(currentUrl, referrerUrl) {
    this.xhr.withCredentials = true;
    this.xhr.open('GET', this._predictorUrl(currentUrl, referrerUrl));
    this.xhr.onload = this._appendLink.bind(this);
    this.xhr.send();
  }

  _appendLink() {
    let nextPath = this.xhr.response;

    if (!nextPath) return;

    Page.appendLink('prerender', nextPath);
  }

  _predictorUrl(currentUrl, referrerUrl) {
    let current  = encodeURIComponent(currentUrl);
    let referrer = encodeURIComponent(referrerUrl);

    let url = `${this.engineUrl}/predict?cur=${current}`;

    if (referrerUrl) url = url + `&ref=${referrer}`;

    return url;
  }

  static predict(engineUrl, requestInfo) {
    requestInfo = this._preprocess(requestInfo);

    if(!requestInfo) return false;

    let instance = new Client(engineUrl);

    // don't try to prerender a page if the current page
    // is prerendered. Otherwise, it leads to prerendering
    // a chain of pages for one request.
    Page.onceVisible(
      () => instance.predict(requestInfo.currentUrl, requestInfo.referrer)
    );
  }

  /**
   * Runs preprocessors which may change the request info or
   * tell the client to not make prediction by returning false or null.
   */
  static _preprocess(requestInfo) {
    for (let processor of preprocessors) {
      requestInfo = processor.process(requestInfo);
      if (!requestInfo) return false;
    }

    return requestInfo;
  }
}

export default Client;
