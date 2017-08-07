/**
 * The lib depends on promises (https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * There are old browsers (for instance, IE11) which don't natively support promises.
 * So, if a browser doesn't support promises, the lib interrupts execution.
 * We don't apply a polyfill, because browsers which don't support promises
 * don't support service worker neither.
 */
const PromiseSupport = {
  process: function(reqInfo) {
    if (typeof Promise === 'undefined') return false;

    return reqInfo;
  }
};

export default PromiseSupport;
