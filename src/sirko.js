import Page from './sirko/page';

/**
 * This prototype tracks the current page visited by a particular user
 * and gets a next page to be visited by the current user.
 */
class Sirko {
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

  static predict(engineUrl, referralUrl) {
    let instance = new Sirko(engineUrl);

    // don't try to prerender a page if the current page
    // is prerendered. Otherwise, it leads to prerendering
    // a chain of pages for one request.
    Page.onceVisible(
      () => instance.predict(window.location, referralUrl)
    );
  }
}

export default Sirko;
