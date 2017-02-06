import Page from './page';

// allow the uglifier to mutilate it
const sessStorage = window.sessionStorage;

class Predictor {
  constructor(engineUrl) {
    this.engineUrl = engineUrl;
    this.xhr = new XMLHttpRequest();
  }

  predict(currentUrl, referrerUrl) {
    let lastPredictionFor = sessStorage.getItem('lastPredictionFor');

    if (lastPredictionFor === currentUrl) {
      let lastPredictionPath = sessStorage.getItem('lastPrediction');

      Page.appendLink('prerender', lastPredictionPath);
    }
    else {
      sessStorage.setItem('lastPredictionFor', currentUrl);

      this.xhr.withCredentials = true;
      this.xhr.open('GET', this._predictorUrl(currentUrl, referrerUrl));
      this.xhr.onload = this._madePrediction.bind(this);
      this.xhr.send();
    }
  }

  _madePrediction() {
    let nextPath = this.xhr.response;
    this._appendLink(nextPath);

    sessStorage.setItem('lastPrediction', nextPath);
  }

  _appendLink(nextPath) {
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
}

export default Predictor;
