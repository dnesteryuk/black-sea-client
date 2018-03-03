import sinon from 'sinon';

import helpers from '../helpers';
import Client from '../../src/sirko/client';
import Storage from '../../src/sirko/storage';

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

    this.server = sinon.fakeServer.create({autoRespond: true});

    this.respond = (path = '/list') => {
      let resp = {
        pages:  [{path: path}],
        assets: []
      };

      this.server.respondWith(
        /sirko\.io/,
        [200, {}, JSON.stringify(resp)]
      );
    };
  });

  afterEach(function() {
    this.server.restore();
    Storage.clear();
  });

  describe('.predict', function() {
    it('resolves the given promise', function() {
      this.respond();

      return Client.predict(this.reqInfo, this.conf).then((res) => {
        let [predictedPages, wasPrevCorrect] = res;

        assert.equal(predictedPages[0].path, '/list');
        assert.equal(wasPrevCorrect, undefined);
      });
    });
  });
});
