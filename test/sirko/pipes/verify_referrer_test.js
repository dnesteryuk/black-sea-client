import VerifyReferrer from '../../../src/sirko/pipes/verify_referrer';

describe('VerifyReferrer', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {
        request: {domain: 'app.io'}
      };
    });

    context('an external referrer', function() {
      it('removes the referrer', function() {
        this.data.request.referrer = 'http://google.com';

        let res = VerifyReferrer.call(this.data);

        assert.equal(res.request.referrer, null);
      });

      context('the internal referrer with http', function() {
        it('keeps the referrer', function() {
          let referrer = 'http://app.io';
          this.data.request.referrer = referrer;

          let res = VerifyReferrer.call(this.data);

          assert.equal(res.request.referrer, referrer);
        });
      });

      context('the internal referrer with https', function() {
        it('keeps the referrer', function() {
          let referrer = 'https://app.io';
          this.data.request.referrer = referrer;

          let res = VerifyReferrer.call(this.data);

          assert.equal(res.request.referrer, referrer);
        });
      });
    });
  });
});
