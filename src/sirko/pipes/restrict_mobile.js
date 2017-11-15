import isMobile from 'ismobilejs/isMobile';

/**
 * Interrupts execution of the pipeline if it is a user on a mobile device.
 * The goal of this check is to safe the battery of the user.
 * Also, the look of a mobile site might be different,
 * hence, the navigation might be different too. It doesn't
 * make any sense to track it.
 */
const RestrictMobile = {
  call: function(data) {
    let mob = new isMobile.Class(data.request.agent);

    if (mob.any) return false;

    return data;
  }
};

export default RestrictMobile;
