import GatherAssets from '../../../src/sirko/pipes/gather_assets';

describe('GatherAssets', function() {
  describe('.call', function() {
    before(function() {
      this.cssFiles = [
        'css/main.css',
        'css/form.css'
      ];

      // add dummy css files, so we can expect them
      this.cssFiles.forEach((file) => { embedCss(file); });

      this.jsFiles = [
        'js/main.js',
        'js/form.js'
      ];

      // add dummy js files, so we can expect them
      this.jsFiles.forEach((file) => { embedResource(file, 'script'); });

      this.imageFiles = [
        'images/logo.png',
        'images/head.png'
      ];

      // add dummy image files, so we can expect them
      this.imageFiles.forEach((file) => { embedResource(file, 'img'); });

      this.origin = window.location.origin;
    });

    it('gathers urls of CSS and JS files', function() {
      let res = GatherAssets.call({request: {}}, {}),
          expectedAssets = this.cssFiles.concat(this.jsFiles);

      expectedAssets.forEach((asset, index) => {
        assert.equal(
          res.request.assets[index],
          `${this.origin}/${asset}`
        );
      });
    });

    context('an images selector is provided', function() {
      it('gathers URLs of images too', function() {
        let res = GatherAssets.call({request: {}}, {imagesSelector: 'img'}),
            startAt = res.request.assets.length - 2;

        this.imageFiles.forEach((asset, index) => {
          assert.equal(
            res.request.assets[startAt + index],
            `${this.origin}/${asset}`
          );
        });
      });
    });

    context('urls to internal resources of a browser', function() {
      beforeEach(function() {
        this.internalCss = 'chrome-extension://internal.css';
        this.internalJs = 'chrome-extension://internal.js';

        embedCss(this.internalCss);
        embedResource(this.internalJs, 'script');
      });

      it('does not include them', function() {
        let res = GatherAssets.call({request: {}}, {});

        assert.notInclude(res.request.assets, this.internalCss);
        assert.notInclude(res.request.assets, this.internalJs);
      });
    });
  });
});

function embedCss(url) {
  let el = document.createElement('link');
  el.href = url;
  el.rel = 'stylesheet';
  document.head.appendChild(el);
}

function embedResource(url, type) {
  let el = document.createElement(type);
  el.src = url;
  document.head.appendChild(el);
}
