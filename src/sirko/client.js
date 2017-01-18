import Page from './page';
import { Class as isMobile } from 'ismobilejs/isMobile';

/**
 * This prototype tracks the current page visited by a particular user
 * and gets a next page to be visited by the current user.
 */
class Client {
  constructor(engineUrl) {
    this.engineUrl = engineUrl;
    this.xhr = new XMLHttpRequest();
  }

  predict(currentUrl, referralUrl) {
    this.xhr.withCredentials = true;
    this.xhr.open('GET', this._predictorUrl(currentUrl, referralUrl));
    this.xhr.onload = this._appendLink.bind(this);
    this.xhr.send();
  }

  _appendLink() {
    let nextPath = this.xhr.response;

    if (!nextPath) return;

    Page.appendLink('prerender', nextPath);
  }

  _predictorUrl(currentUrl, referralUrl) {
    let current  = encodeURIComponent(currentUrl);
    let referral = encodeURIComponent(referralUrl);

    let url = `${this.engineUrl}/predict?cur=${current}`;

    if (referralUrl) url = url + `&ref=${referral}`;

    return url;
  }

  static predict(engineUrl, requestInfo) {
    if (!this.isTrackable(requestInfo.agent)) return false;

    let instance = new Client(engineUrl);

    // don't try to prerender a page if the current page
    // is prerendered. Otherwise, it leads to prerendering
    // a chain of pages for one request.
    Page.onceVisible(
      () => instance.predict(window.location, requestInfo.referral)
    );
  }

  /**
   * If it is a user from a mobile phone, the client should track
   * the user's navigation and no prediction should be made.
   * The goal of this check is to safe the battery of a user.
   * Also, the look of a mobile site might be different,
   * hence, the navigation might be different too.
   */
  static isTrackable(userAgent) {
    let mob = new isMobile(userAgent);

    return !mob.any;
  }
}

export default Client;
