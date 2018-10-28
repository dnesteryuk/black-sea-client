import Client from '../../src/sirko/client';
import Storage from '../../src/sirko/storage';

import { predictedList } from '../support/prediction_stub';

describe('Client', function() {
  beforeEach(function() {
    this.reqInfo = {
      agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) ' +
        'Gecko/20100101 Firefox/50.0',
      currentUrl: 'http://app.io/',
      domain: 'app.io'
    };

    this.conf = {
      engineUrl: 'https://sirko.io'
    };
  });

  afterEach(function() {
    Storage.clear();
  });

  describe('.predict', function() {
    it('resolves the given promise', async function() {
      let [predictedPages, wasPrevCorrect] = await Client.predict(this.reqInfo, this.conf);

      assert.deepEqual(predictedPages, predictedList.pages);
      assert.equal(wasPrevCorrect, undefined);
    });
  });
});
