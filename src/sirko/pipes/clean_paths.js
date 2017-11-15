/**
 * Removes the domain and protocol from the current and the referrer paths.
 */
const CleanPath = {
  call: function(data) {
    let request = data.request,
        reg = new RegExp(`^http(s)?://${request.domain}(.*)?/`);

    request.currentPath = request.currentPath.replace(reg, '/');

    if (request.referrer) {
      request.referrer = request.referrer.replace(reg, '/');
    }

    return data;
  }
};

export default CleanPath;
