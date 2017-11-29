/**
 * Tracks requests caught by a service worker and helps to figure out
 * whether there are requests modifying data between the referrer and
 * the current page.
 */
const Traffic = {
  records: [],

  add: function(request) {
    this.records.push({
      method: request.method,
      url:    request.url
    });
  },

  /**
   * Returns true if there are requests modifying data between the referrer
   * and the current page. Otherwise, returns false.
   *
   * This method only considers requests related to the given domain.
   * If there are requests which modify data, but they need to be excluded from
   * the logic, urls of those requests should be added to the whitelist.
   */
  modifiedState: function(referrerUrl, currentUrl, domain, whitelist = []) {
    let referrerPos = this._findIndexOfOldestRecord(referrerUrl),
        currentPos  = this._findIndexOfNewestRecord(currentUrl);

    let referrer = this.records[referrerPos],
        current  = this.records[currentPos];

    // if the referrer cannot be found, there is no way to detect requests
    // between the referrer and the current page. So, it is safer to return true
    // and pretend that there are requests modifying data.
    if (!referrer || this._methodModifingData(current.method))
      return true;

    let reg = new RegExp(`^http(s)?://${domain}`);

    for (let i = referrerPos + 1; i < currentPos; i++) {
      let record = this.records[i];

      if (whitelist.indexOf(record.url) > -1 || !reg.test(record.url))
        continue;

      if (this._methodModifingData(record.method))
        return true;
    }

    return false;
  },

  clean: function() {
    this.records = [];
  },

  /**
   * Removes requests happened before the request with the given url.
   * Since there might be a few records with the same url (it occurs
   * after refreshing the page), this method looks for the most recent request
   * and removes everything before it.
   */
  removeAllBefore: function(url) {
    let index = this._findIndexOfNewestRecord(url);

    if (index < 0) return;

    this.records = this.records.slice(
      index,
      this.records.length
    );
  },

  _findIndexOfOldestRecord: function(url) {
    return this.records.findIndex((record) => {
      return record.url === url;
    })
  },

  _findIndexOfNewestRecord: function(url) {
    return this.records.reduce(function(foundIndex, record, i) {
      if (record.url === url) foundIndex = i;
      return foundIndex;
    }, -1);
  },

  _methodModifingData: function(method) {
    return method !== 'GET' && method !== 'OPTIONS';
  }
};

export default Traffic;
