import { predictedList } from './prediction_stub';

/**
 * A collection of stubs to HTTP requests.
 */
const HttpStubs = {
  // default stubs
  items: {
    'POST': {
      '/sirko.io/predict/': {
        url: /sirko\.io\/predict/,
        response: predictedList
      }
    },
    'GET': {}
  },

  /**
   * Registers a new stub. The URL must be provided as a regular expression.
   * A stub for the same URL will override the previous one.
   *
   * @param {object} details
   *
   * @example
   *
   * HttpStubs.register({
   *   method: 'POST',
   *   url: /\/predict/,
   *   response: {assets: [], pages: []}
   * });
   */
  register: function(details) {
    this.items[details.method][details.url] = details;
  },

  /**
   * Finds a stub for the given method and URL.
   *
   * @param {string} method - The method in uppercase.
   * @param {string} url
   *
   * @example
   *
   * HttpStubs.find('POST', 'https://sirko.io/predict')
   */
  find: function(method, url) {
    for(let key in this.items[method]){
      let details = this.items[method][key];

      if (details.url.test(url))
        return details;
    }
  }
};

export default HttpStubs;
