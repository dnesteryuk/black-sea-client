/**
 * Gathers urls of JS and CSS files on the current page,
 * so those urls can be stored on the backend.
 */
const GatherAssets = {
  call: function(data) {
    let assets = Array.prototype.slice.call(
      document.querySelectorAll('link[rel="stylesheet"]')
    ).map((item) => { return item.href; });

    Array.prototype.slice.call(
      document.querySelectorAll('script[src]')
    ).forEach((item) => { assets.push(item.src); });

    data.request.assets = assets;

    return data;
  }
};

export default GatherAssets;
