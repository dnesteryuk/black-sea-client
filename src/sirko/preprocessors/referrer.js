/**
 * Removes the referrer from the request info if it is an external one.
 */
const Referrer = {
  process: function(requestInfo) {
    let referrer = requestInfo.referrer;

    let reg = new RegExp(`^http(s)?://${requestInfo.domain}`);

    if (referrer && !reg.test(referrer)) referrer = null;

    requestInfo.referrer = referrer;

    return requestInfo;
  }
}

export default Referrer;
