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
      this.cssFiles.forEach(function(file) {
        let el = document.createElement('link');
        el.href = file;
        el.rel = 'stylesheet';
        document.head.appendChild(el);
      });

      this.jsFiles = [
        'js/main.js',
        'js/form.js',
        'js/flash.js',
        'js/popup.js',
        'js/template.js'
      ];

      // add dummy js files, so we can expect them
      this.jsFiles.forEach(function(file) {
        let el = document.createElement('script');
        el.src = file;
        document.head.appendChild(el);
      });
    });

    it('gathers urls of CSS and JS files', function() {
      let res = GatherAssets.call({request: {}}),
          expectedAssets = this.cssFiles.concat(this.jsFiles),
          origin = document.location.origin;

      expectedAssets.forEach(function(asset, index) {
        assert.equal(
          res.request.assets[index],
          `${origin}/${asset}`
        );
      });
    });
  });
});
