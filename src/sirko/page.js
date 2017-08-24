/**
 * It is kind of an object keeping helper methods to work with pages.
 */
const Page = {
  /**
   * Creates a link tag and adds it to the head of a document.
   *
   * rel  - The value for the rel attribute.
   * href - The value for the href attribute.
   */
  appendLink: function(rel, href) {
    let link = document.createElement('link');
    link.href = href;
    link.rel = rel;

    document.head.appendChild(link);
  }
};

export default Page;
