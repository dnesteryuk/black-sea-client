/**
 * Tracks requests caught by a service worker and helps to figure out
 * whether there are requests modifying data between the referrer and
 * the current page.
 *
 * Since the service worker works on all pages at the same time, there might
 * be intersections. For example:
 *
 *   GET /index
 *   POST /post
 *   GET /posts
 *   GET /project
 *
 * Let's say the index page is a referrer and the project page is a current page.
 * Using the logic described above, we can say there was a request modifying data.
 * But, it might be false. There is a chance that the user used 2 pages at the same
 * time, thus, they made an action on one page, then they made an action on another
 * page without waiting for completion of the first action.
 *
 * This situation is fine, the module will tell that there was a request modifying
 * data. There is no problem with that, because it is a rare case, most users won't
 * do that. Anyway, there is no easy solution to understand where requests come from,
 * they just come to the worker.
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
    let referrerPos = findIndexOfOldestRecord.call(this, referrerUrl),
        currentPos  = findIndexOfNewestRecord.call(this, currentUrl);

    let referrer = this.records[referrerPos],
        current  = this.records[currentPos];

    // if the referrer cannot be found, there is no way to detect requests
    // between the referrer and the current page. So, it is safer to return true
    // and pretend that there are requests modifying data.
    if (!referrer || methodModifingData(current.method))
      return true;

    let reg = new RegExp(`^http(s)?://${domain}`);

    for (let i = referrerPos + 1; i < currentPos; i++) {
      let record = this.records[i];

      if (whitelist.indexOf(record.url) > -1 || !reg.test(record.url))
        continue;

      if (methodModifingData(record.method))
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
    let index = findIndexOfNewestRecord.call(this, url);

    if (index < 0) return;

    this.records = this.records.slice(
      index,
      this.records.length
    );
  }
};

// private methods

function findIndexOfOldestRecord(url) {
  return this.records.findIndex((record) => {
    return record.url === url;
  })
}

function findIndexOfNewestRecord(url) {
  return this.records.reduce((foundIndex, record, i) => {
    if (record.url === url) foundIndex = i;
    return foundIndex;
  }, -1);
}

function methodModifingData(method) {
  return method !== 'GET' && method !== 'OPTIONS';
}

export default Traffic;
