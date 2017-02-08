/**
 * Removes the domain and protocol from the current path and the referrer.
 */
const PathCleaner = {
  process: function(reqInfo) {
    let reg = new RegExp(`^http(s)?://${reqInfo.domain}(.*)?/`);

    reqInfo.currentPath = reqInfo.currentPath.replace(reg, '/');

    if (reqInfo.referrer) {
      reqInfo.referrer = reqInfo.referrer.replace(reg, '/');
    }

    return reqInfo;
  }
};

export default PathCleaner;
