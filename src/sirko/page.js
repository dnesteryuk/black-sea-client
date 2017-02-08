/**
 * It is kind of an object keeping helper methods to work with pages.
 */
const Page = {
  /**
   * Calls the given callback once a page is visible.
   * The callback gets called only once.
   */
  onceVisible: function() {
    let doc = document;

    return new Promise((resolve, reject) => {
      if (doc.visibilityState === 'visible') {
        resolve();
      }
      else {
        let fn = () => {
          if (doc.visibilityState === 'visible') {
            doc.removeEventListener('visibilitychange', fn);
            resolve();
          }
        };

        doc.addEventListener('visibilitychange', fn);
      }
    });
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
