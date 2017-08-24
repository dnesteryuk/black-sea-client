import assert from 'assert';

import Assets from '../../../src/sirko/preprocessors/assets';

describe('Assets', function() {
  describe('.process', function() {
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

    it('gathers urls to CSS and JS files', function() {
      let res = Assets.process({});

      let expectedAssets = this.cssFiles.concat(this.jsFiles);

      let origin = document.location.origin;

      expectedAssets.forEach(function(asset, index) {
        assert.equal(
          res.assets[index],
          `${origin}/${asset}`
        );
      });
    });
  });
});
