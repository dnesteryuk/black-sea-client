/**
 * This prototype tracks the current page visited by a particular user
 * and gets a next page which will be visited by the current user.
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

    let link = document.createElement('link');
    link.setAttribute('href', nextPath);
    link.setAttribute('rel', 'prerender');

    let head = document.querySelector('head');
    head.appendChild(link);
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
    instance.predict(window.location, referralUrl);
  }
}

export default Sirko;