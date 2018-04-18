import GatherAssets from '../../../src/sirko/pipes/gather_assets';

describe('GatherAssets', function() {
  describe('.call', function() {
    before(function() {
      this.cssFiles = [
        'css/main.css',
        'css/form.css',
        'css/flash.css',
        'css/popup.css',
        'css/template.css'
      ];

      // add dummy css files, so we can expect them
      this.cssFiles.forEach((file) => { embedCss(file); });

      this.jsFiles = [
        'js/main.js',
        'js/form.js',
        'js/flash.js',
        'js/popup.js',
        'js/template.js'
      ];

      // add dummy js files, so we can expect them
      this.jsFiles.forEach((file) => { embedJs(file); });
    });

    it('gathers urls of CSS and JS files', function() {
      let res = GatherAssets.call({request: {}}),
          expectedAssets = this.cssFiles.concat(this.jsFiles),
          origin = window.location.origin;

      expectedAssets.forEach(function(asset, index) {
        assert.equal(
          res.request.assets[index],
          `${origin}/${asset}`
        );
      });
    });

    context('urls to internal resources of a browser', function() {
      beforeEach(function() {
        this.internalCss = 'chrome-extension://internal.css';
        this.internalJs = 'chrome-extension://internal.js';

        embedCss(this.internalCss);
      });

      it('does not include them', function() {
        let res = GatherAssets.call({request: {}});

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

function embedJs(url) {
  let el = document.createElement('script');
  el.src = url;
  document.head.appendChild(el);
}
