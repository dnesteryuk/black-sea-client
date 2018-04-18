/**
 * Extracts paths from the current and the referrer urls.
 */
const CleanPath = {
  call: function(data) {
    let request = data.request,
        reg = new RegExp(`^${request.origin}`);

    request.currentPath = request.currentUrl.replace(reg, '');

    if (request.referrer) {
      request.referrer = request.referrer.replace(reg, '');
    }

    return data;
  }
};

export default CleanPath;
