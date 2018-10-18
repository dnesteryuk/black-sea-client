/**
 * Gathers urls of JS, image and CSS files on the current page,
 * so those urls can be stored on the backend.
 */
const GatherAssets = {
  call: function(data, conf) {
    let assets = [];

    addAssets(document.querySelectorAll('link[rel="stylesheet"]'), assets, 'href');
    addAssets(document.querySelectorAll('script[src]'), assets);

    if (conf.imagesSelector)
      addAssets(document.querySelectorAll(conf.imagesSelector), assets);

    data.request.assets = assets;

    return data;
  }
};

const HttpPattern = new RegExp('^http(s)?://');

function isHttp(url) {
  return HttpPattern.test(url);
}

function addAssets(nodes, assets, attr = 'src') {
  Array.prototype.slice.call(nodes).forEach((item) => {
    if (isHttp(item[attr])) assets.push(item[attr]);
  });
}

export default GatherAssets;
