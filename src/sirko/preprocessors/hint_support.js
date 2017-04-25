/**
 * Detects whether the current browser supports the prerender hint. If no,
 * it falls back to a service worker-based mechanism.
 */
const HintSupport = {
  process: function(reqInfo) {
    let link = document.createElement('link');
    let relList = link.relList;

    reqInfo.hint = 'fallback';

    if (relList && relList.supports && relList.supports('prerender')) {
      reqInfo.hint = 'prerender';
    }

    return reqInfo;
  }
};

export default HintSupport;
