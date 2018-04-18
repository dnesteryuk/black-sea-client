/**
 * Gathers urls of JS and CSS files on the current page,
 * so those urls can be stored on the backend.
 */
const GatherAssets = {
  call: function(data) {
    let assets = [];

    Array.prototype.slice.call(
      document.querySelectorAll('link[rel="stylesheet"]')
    ).forEach((item) => {
      if (isHttp(item.href)) assets.push(item.href);
    });

    Array.prototype.slice.call(
      document.querySelectorAll('script[src]')
    ).forEach((item) => {
      if (isHttp(item.src)) assets.push(item.src);
    });

    data.request.assets = assets;

    return data;
  }
};

const HttpPattern = new RegExp('^http(s)?://');

function isHttp(url) {
  return HttpPattern.test(url);
}

export default GatherAssets;
