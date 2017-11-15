import Pipeline from './pipeline';

/**
 * Gathers info (a path and assets) of the current page.
 * The gathered info gets sent to the engine. The engine responds with
 * info about a next page which might be visited by a user on
 * this page. The response contains the path to the page and assets
 * of that page. Thus, once response is received the client prefetches
 * the predicted page and assets.
 */
const Client = {
  predict: function(reqInfo, conf) {
    return Pipeline.call(reqInfo, conf);
  }
};

export default Client;
