// allow the uglifier to mutilate it
const sessStorage = window.sessionStorage;

/**
 * Takes care about HTTP communication via Ajax to the engine.
 * If the current path hasn't changed (for instance, the user has refreshed the page),
 * the cached prediction gets returned without making a request to the engine. This approach
 * helps to avoid needless load on the server and it fixes the issue with increasing
 * counts of transitions between pages when it mustn't happen.
 */
class Predictor {
  constructor(engineUrl) {
    this.engineUrl = engineUrl;
    this.xhr = new XMLHttpRequest();
  }

  predict(currentPath, referrerPath) {
    return new Promise((resolve) => {
      this._makePrediction(currentPath, referrerPath, resolve);
    });
  }

  /**
   * Returns the prediction which was made for the previous page.
   */
  prevPrediction() {
    return sessStorage.getItem('prevPrediction');
  }

  /**
   * Returns the prediction which is made for the current page.
   */
  prediction() {
    return sessStorage.getItem('lastPrediction');
  }

  _makePrediction(currentPath, referrerPath, resolve) {
    let lastPredictionFor = sessStorage.getItem('lastPredictionFor');

    if (lastPredictionFor === currentPath) {
      resolve([this.prediction(), true]);
    }
    else {
      this.xhr.withCredentials = true;
      this.xhr.open('GET', this._predictorUrl(currentPath, referrerPath));

      this.xhr.onload = function() {
        sessStorage.setItem('lastPredictionFor', currentPath);

        this._madePrediction();
        resolve([this.prediction(), false]);
      }.bind(this);

      this.xhr.send();
    }
  }

  _madePrediction() {
    let nextPath = this.xhr.response;

    // it is empty if there isn't a prediction for the previous request
    let lastPrediction = sessStorage.getItem('lastPrediction');

    if (lastPrediction) {
      sessStorage.setItem(
        'prevPrediction',
        lastPrediction
      );
    }
    else {
      // it must be undefined if there isn't a prediction
      sessStorage.removeItem('prevPrediction');
    }

    sessStorage.setItem('lastPrediction', nextPath);
  }

  _predictorUrl(currentPath, referrerPath) {
    let current  = encodeURIComponent(currentPath);
    let referrer = encodeURIComponent(referrerPath);

    let url = `${this.engineUrl}/predict?cur=${current}`;

    if (referrerPath) url = url + `&ref=${referrer}`;

    return url;
  }
}

export default Predictor;
