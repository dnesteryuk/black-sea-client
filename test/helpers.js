let userAgent = window.navigator.userAgent;

/**
 * It is kind of a set of helpers for tests.
 */
const Helpers = {
  /**
   * It isn't the best way to detect a browser,
   * but it should work fine for developers.
   */
  isChrome: function() {
    return /Chrome/.test(userAgent)
  },

  isFirefox: function() {
    return /Firefox/.test(userAgent)
  },

  removeHint: function(rel) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (link) link.parentNode.removeChild(link);
  }
};

export default Helpers;
