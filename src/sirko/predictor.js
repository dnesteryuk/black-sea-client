/**
 * Takes care about HTTP communication via Ajax to the engine.
 */
class Predictor {
  constructor(engineUrl) {
    this.engineUrl = engineUrl;
    this.xhr = new XMLHttpRequest();
  }

  /**
   * Makes a request to the engine in order to get info about a next page.
   *
   * entry - The object keeping information about the current page.
   *   currentPath:  - The path of the current page.
   *   referrerPath: - The path of the referrer which leads to the current page.
   *   assets:       - The list of JS and CSS files on the current page.
   */
  predict(entry) {
    return new Promise((resolve) => {
      this._makePrediction(entry, resolve);
    });
  }

  _makePrediction(entry, resolve) {
    this.xhr.withCredentials = true;
    this.xhr.open('POST', this.engineUrl);
    this.xhr.setRequestHeader('Content-Type', 'application/json');

    this.xhr.onload = () => {
      resolve(JSON.parse(this.xhr.response));
    };

    this.xhr.send(this._requestBody(entry));
  }

  _requestBody(entry) {
    let data = {
      current: entry.currentPath,
      assets:  entry.assets
    };

    if (entry.referrerPath) data.referrer = entry.referrerPath;

    return JSON.stringify(data);
  }
}

export default Predictor;
