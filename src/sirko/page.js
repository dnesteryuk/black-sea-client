/**
 * It is kind of an object keeping helper methods to work with pages.
 */
const Page = {
  /**
   * Calls the given callback once a page is visible.
   * The callback gets called only once.
   */
  onceVisible: function(callback) {
    if (document.visibilityState === 'visible') {
      callback.call(this);
    }
    else {
      let fn = function() {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', fn);

          callback.call(this);
        }
      };

      document.addEventListener('visibilitychange', fn);
    }
  },

  /**
   * Creates a link tag and adds it to the head of a document.
   *
   * rel  - A value for the rel attribute.
   * href - A value for the href attribute.
   */
  appendLink: function(rel, href) {
    let link = document.createElement('link');
    link.setAttribute('href', href);
    link.setAttribute('rel', rel);

    let head = document.querySelector('head');
    head.appendChild(link);
  }
};

export default Page;
