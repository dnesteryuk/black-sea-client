/**
 * Removes the referrer from the request info if it is an external one.
 */
const VerifyReferrer = {
  call: function(data) {
    let referrer = data.request.referrer,
        reg = new RegExp(`^http(s)?://${data.request.domain}`);

    if (referrer && !reg.test(referrer)) referrer = null;

    data.request.referrer = referrer;

    return data;
  }
}

export default VerifyReferrer;
