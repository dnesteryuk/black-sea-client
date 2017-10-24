import Referrer from '../../../src/sirko/preprocessors/referrer';

describe('Referrer', function() {
  describe('.process', function() {
    beforeEach(function() {
      this.reqInfo = {
        domain: 'app.io'
      };
    });

    context('the external referrer', function() {
      it('removes the referrer', function() {
        this.reqInfo.referrer = 'http://google.com';

        let res = Referrer.process(this.reqInfo);

        assert.equal(res.referrer, null);
      });

      context('the internal referrer with http', function() {
        it('keeps the referrer', function() {
          let referrer = 'http://app.io';
          this.reqInfo.referrer = referrer;

          let res = Referrer.process(this.reqInfo);

          assert.equal(res.referrer, referrer);
        });
      });

      context('the internal referrer https', function() {
        it('keeps the referrer', function() {
          let referrer = 'https://app.io';
          this.reqInfo.referrer = referrer;

          let res = Referrer.process(this.reqInfo);

          assert.equal(res.referrer, referrer);
        });
      });
    });
  });
});
