/**
 * Gathers urls to JS and CSS files on the current page,
 * so those urls can be stored on the backend.
 */
const Assets = {
  process: function(reqInfo) {
    let assets = Array.prototype.slice.call(
      document.querySelectorAll('link[rel="stylesheet"]')
    ).map(function(item) { return item.href; });

    Array.prototype.slice.call(
      document.querySelectorAll('script[src]')
    ).forEach(function(item) { assets.push(item.src); });

    reqInfo.assets = assets;

    return reqInfo;
  }
};

export default Assets;
