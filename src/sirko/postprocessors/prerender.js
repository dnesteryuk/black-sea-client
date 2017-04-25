import Page from '../page';

/**
 * Adds the prerender resource hint to the DOM,
 * if it is supported by the browser.
 */
const Prerender = {
  process: function(info) {
    if (info.nextPath && info.hint === 'prerender') {
      Page.appendLink('prerender', info.nextPath);
    }

    return info;
  }
};

export default Prerender;
