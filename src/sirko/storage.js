// allow the uglifier to mutilate it
const sessStorage = window.sessionStorage;

/**
 * Provides handy methods to work with the sessionStorage
 * https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage.
 *
 * The sessionStorage only stores string values. This class provides a way
 * to store objects by serializing them to the JSON format.
 */
const Storage = {
  /**
   * Writes the given value in the storage.
   */
  put: function(key, val) {
    if (typeof val === 'object')
      val = JSON.stringify(val);

    sessStorage.setItem(key, val);
  },

  /**
   * Reads a value from the storage.
   */
  pull: function(key) {
    let val = sessStorage.getItem(key);

    if (!val) return;
    if (val.charAt(0) === '{')
      val = JSON.parse(val);

    return val;
  },

  /**
   * Shift a value from one key to another. Since it doesn't pay attention to
   * the value's type, it works faster than a combination of the put/pull calls.
   */
  shift: function(from, to) {
    let val = sessStorage.getItem(from);

    // there is nothing to shift
    if (!val) return;

    sessStorage.setItem(to, val);
  },

  /**
   * Removes all data from the storage.
   */
  clear: function() {
    sessStorage.clear();
  }
};

export default Storage;
