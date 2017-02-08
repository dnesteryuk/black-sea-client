import { Class as isMobile } from 'ismobilejs/isMobile';

/**
 * Resets the request info if it is a user on a mobile device.
 * The goal of this check is to safe the battery of the user.
 * Also, the look of a mobile site might be different,
 * hence, the navigation might be different too. It doesn't
 * make any sense to track it.
 */
const Mobile = {
  process: function(reqInfo) {
    let mob = new isMobile(reqInfo.agent);

    if (mob.any) return false;

    return reqInfo;
  }
};

export default Mobile;
