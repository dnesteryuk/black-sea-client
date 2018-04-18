/**
 * Removes the referrer from the request info if it is an external one.
 */
const VerifyReferrer = {
  call: function(data) {
    let referrer = data.request.referrer,
        reg = new RegExp(`^${data.request.origin}`);

    if (referrer && !reg.test(referrer)) referrer = null;

    data.request.referrer = referrer;

    return data;
  }
}

export default VerifyReferrer;
