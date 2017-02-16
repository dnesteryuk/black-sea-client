import assert from 'assert';
import sinon from 'sinon';

import Client from '../../src/sirko/client';

describe('Client', function() {
  beforeEach(function() {
    this.reqInfo = {
      agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) ' +
        'Gecko/20100101 Firefox/50.0',
      currentPath: '/',
      domain: 'app.io'
    };

    this.server = sinon.fakeServer.create({autoRespond: true});

    this.respond = (path = '/list') => {
      this.server.respondWith(
        /sirko\.io/,
        [200, {}, path]
      );
    };
  });

  afterEach(function() {
    this.server.restore();

    sessionStorage.clear();

    let link = document.querySelector('link[rel="prerender"]');

    if (link) link.parentNode.removeChild(link);
  });

  describe('.predict', function() {
    it('appends a link tag declaring the browser to prerender the given url', function() {
      this.respond();

      return Client.predict('https://sirko.io', this.reqInfo).then(() => {
        let link = document.querySelector('link[rel="prerender"]');

        assert(link);
        assert.equal(link.href, 'http://localhost:9876/list');
      });
    });

    context('there is not a prediction for the previous request', function() {
      it('passes undefined as the second element of the resulting array', function() {
        this.respond();

        return Client.predict('https://sirko.io', this.reqInfo).then((res) => {
          let [_, isPrevCorrect] = res;

          assert.equal(isPrevCorrect, undefined);
        });
      });
    });

    context('the previous prediction is correct', function() {
      it('passes true as the second element of the resulting array', function() {
        sessionStorage.setItem('lastPrediction', '/');

        this.respond();

        return Client.predict('https://sirko.io', this.reqInfo).then((res) => {
          let [_, isPrevCorrect] = res;

          assert.equal(isPrevCorrect, true);
        });
      });
    });

    context('the previous prediction is incorrect', function() {
      it('passes false as the second element of the resulting array', function() {
        sessionStorage.setItem('lastPrediction', '/about');

        this.respond();

        return Client.predict('https://sirko.io', this.reqInfo).then((res) => {
          let [_, wasPrevCorrect] = res;

          assert.equal(wasPrevCorrect, false);
        });
      });
    });

    context('the current prediction is taken from the cache', function() {
      it('passes undefined as the second element of the resulting array', function() {
        sessionStorage.setItem('lastPrediction', '/about');
        sessionStorage.setItem('lastPredictionFor', this.reqInfo.currentPath);

        this.respond();

        return Client.predict('https://sirko.io', this.reqInfo).then((res) => {
          let [_, wasPrevCorrect] = res;

          assert.equal(wasPrevCorrect, undefined);
        });
      });
    });

    context('the engine does not make prediction', function() {
      beforeEach(function() {
        this.respond('');
      });

      it('does not append a link tag', function() {
        return Client.predict('https://sirko.io', this.reqInfo).then(() => {
          let link = document.querySelector('link[rel="prerender"]');
          assert.equal(link, null);
        });
      });
    });

    context('it is a mobile browser', function() {
      beforeEach(function() {
        this.reqInfo.agent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 4 Build/LMY48T)' +
          ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36';
      });

      it('returns false right away', function() {
        let res = Client.predict('https://sirko.io', this.reqInfo);

        assert.equal(res, false);
      });
    });

    context('the referrer belongs to an external site', function() {
      beforeEach(function() {
        this.reqInfo.referrer = 'http://www.google.com/some-path';
        this.respond();
      });

      it('does not send the referrer', function() {
        return Client.predict('https://sirko.io', this.reqInfo).then(() => {
          let request = this.server.requests[0];

          assert.equal(
            request.url,
            'https://sirko.io/predict?cur=%2F'
          );
        });
      });
    });
  });
});
