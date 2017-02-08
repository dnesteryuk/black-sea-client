/**
 * Removes the referrer from the request info if it is an external one.
 */
const Referrer = {
  process: function(reqInfo) {
    let referrer = reqInfo.referrer;

    let reg = new RegExp(`^http(s)?://${reqInfo.domain}`);

    if (referrer && !reg.test(referrer)) referrer = null;

    reqInfo.referrer = referrer;

    return reqInfo;
  }
}

export default Referrer;
