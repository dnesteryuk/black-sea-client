import RestrictMobile from '../../../src/sirko/pipes/restrict_mobile';

describe('RestrictMobile', function() {
  describe('.call', function() {
    beforeEach(function() {
      this.data = {request: {}};
    });

    context('it is a mobile browser', function() {
      beforeEach(function() {
        this.data.request.agent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 4 Build/LMY48T)' +
          ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.91 Mobile Safari/537.36';
      });

      it('returns false', function() {
        let res = RestrictMobile.call(this.data);

        assert.equal(res, false);
      });
    });

    context('it is a desktop browser', function() {
      beforeEach(function() {
        this.data.request.agent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) ' +
          'Gecko/20100101 Firefox/50.0';
      });

      it('returns the given data back', function() {
        let res = RestrictMobile.call(this.data);

        assert.equal(res, this.data);
      });
    })
  });
});
