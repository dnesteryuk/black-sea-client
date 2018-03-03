import Barn from '../barn';

/**
 * Removes prefetched resources if the offline mode isn't enabled.
 * Otherwise, moves prefetched resources to the offline cache, so
 * it can be used when a user is offline.
 */
const CleanCache = {
  call: function(data, conf) {
    if (conf.offline) {
      Barn.shift();
    }
    else {
      Barn.cleanPrefetch();
    }

    return data;
  }
};

export default CleanCache;
