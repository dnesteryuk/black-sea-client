"use strict";function createCommonjsModule(e,r){return r={exports:{}},e(r,r.exports),r.exports}var Page={appendLink:function(e,r){var t=document.createElement("link");t.href=r,t.rel=e,document.head.appendChild(t)}},Predictor=function(e){this.engineUrl=e,this.xhr=new XMLHttpRequest};Predictor.prototype.predict=function(e){var r=this;return new Promise(function(t){r._makePrediction(e,t)})},Predictor.prototype._makePrediction=function(e,r){var t=this;this.xhr.withCredentials=!0,this.xhr.open("POST",this._predictorUrl()),this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.onload=function(){r(JSON.parse(t.xhr.response))},this.xhr.send(this._requestBody(e))},Predictor.prototype._predictorUrl=function(){return this.engineUrl+"/predict"},Predictor.prototype._requestBody=function(e){var r={current:e.currentPath,assets:e.assets};return e.referrerPath&&(r.referrer=e.referrerPath),JSON.stringify(r)};var commonjsGlobal="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},isMobile=createCommonjsModule(function(e){!function(r){var t=/iPhone/i,i=/iPod/i,n=/iPad/i,o=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,s=/Android/i,c=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,a=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,p=/Windows Phone/i,d=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,u=/BlackBerry/i,h=/BB10/i,l=/Opera Mini/i,f=/(CriOS|Chrome)(?=.*\bMobile\b)/i,b=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,P=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),g=function(e,r){return e.test(r)},v=function(e){var r=e||navigator.userAgent,v=r.split("[FBAN");if(void 0!==v[1]&&(r=v[0]),void 0!==(v=r.split("Twitter"))[1]&&(r=v[0]),this.apple={phone:g(t,r),ipod:g(i,r),tablet:!g(t,r)&&g(n,r),device:g(t,r)||g(i,r)||g(n,r)},this.amazon={phone:g(c,r),tablet:!g(c,r)&&g(a,r),device:g(c,r)||g(a,r)},this.android={phone:g(c,r)||g(o,r),tablet:!g(c,r)&&!g(o,r)&&(g(a,r)||g(s,r)),device:g(c,r)||g(a,r)||g(o,r)||g(s,r)},this.windows={phone:g(p,r),tablet:g(d,r),device:g(p,r)||g(d,r)},this.other={blackberry:g(u,r),blackberry10:g(h,r),opera:g(l,r),firefox:g(b,r),chrome:g(f,r),device:g(u,r)||g(h,r)||g(l,r)||g(b,r)||g(f,r)},this.seven_inch=g(P,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window)return this},w=function(){var e=new v;return e.Class=v,e};e.exports&&"undefined"==typeof window?e.exports=v:e.exports&&"undefined"!=typeof window?e.exports=w():r.isMobile=w()}(commonjsGlobal)}),Mobile={process:function(e){return!new isMobile.Class(e.agent).any&&e}},PromiseSupport={process:function(e){return"undefined"!=typeof Promise&&e}},Register={process:function(e){return"serviceWorker"in navigator&&(navigator.serviceWorker.register("sirko_sw.js"),caches.delete("sirko-pages")),e}},Referrer={process:function(e){var r=e.referrer,t=new RegExp("^http(s)?://"+e.domain);return r&&!t.test(r)&&(r=null),e.referrer=r,e}},PathCleaner={process:function(e){var r=new RegExp("^http(s)?://"+e.domain+"(.*)?/");return e.currentPath=e.currentPath.replace(r,"/"),e.referrer&&(e.referrer=e.referrer.replace(r,"/")),e}},sessStorage=window.sessionStorage,Storage={put:function(e,r){"object"==typeof r&&(r=JSON.stringify(r)),sessStorage.setItem(e,r)},pull:function(e){var r=sessStorage.getItem(e);if(r)return"{"===r.charAt(0)&&(r=JSON.parse(r)),r},shift:function(e,r){var t=sessStorage.getItem(e);t&&sessStorage.setItem(r,t)},clear:function(){sessStorage.clear()}},Cache={process:function(e){return Storage.pull("lastPredictionFor")===e.currentPath&&(e.prediction=Storage.pull("lastPrediction"),e.prediction.cached=!0),e}},Assets={process:function(e){var r=Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet"]')).map(function(e){return e.href});return Array.prototype.slice.call(document.querySelectorAll("script[src]")).forEach(function(e){r.push(e.src)}),e.assets=r,e}},Page$2={process:function(e){return e.path&&"serviceWorker"in navigator&&caches.open("sirko-pages").then(function(r){r.add(e.path)}),e}},Assets$1={process:function(e,r){return e.assets&&e.assets.forEach(function(e){r.assets.indexOf(e)>-1||Page.appendLink("prefetch",e)}),e}},Cache$1={process:function(e,r){return Storage.shift("lastPrediction","prevPrediction"),Storage.put("lastPrediction",e),Storage.put("lastPredictionFor",r.currentPath),e}},Correctness={process:function(e,r){var t=Storage.pull("prevPrediction");return!e.cached&&t&&(e.isPrevCorrect=t.path===r.currentPath),e}},Processor={preprocessors:[Mobile,PromiseSupport,Register,Referrer,PathCleaner,Cache,Assets],postprocessors:[Page$2,Assets$1,Cache$1,Correctness],preprocess:function(e,r){return this._runProcessors(this.preprocessors,e,r)},postprocess:function(e,r,t){return this._runProcessors(this.postprocessors,e,r,t)},_runProcessors:function(e,r,t){for(var i=0;i<e.length;i++)if(!(r=e[i].process(r,t)))return!1;return r}},Client={predict:function(e,r){if(!(e=Processor.preprocess(e,r)))return!1;return(e.prediction?new Promise(function(r){r(e.prediction)}):new Predictor(r.engineUrl).predict({currentPath:e.currentPath,referrerPath:e.referrer,assets:e.assets})).then(function(r){var t=Processor.postprocess(r,e);return new Promise(function(e){e([t.path,t.isPrevCorrect])})})}},sirko=window.sirko;if(sirko){var reqInfo={agent:window.navigator.userAgent,referrer:document.referrer,currentPath:window.location.href,domain:document.domain},clientObj={};sirko.q.forEach(function(e){var r=e[0],t=e[1];clientObj[r]=t}),window.sirko=function(e,r){clientObj.prediction&&"predicted"===e?r.apply(this,clientObj.prediction):clientObj[e]=r},Client.predict(reqInfo,clientObj).then(function(e){clientObj.predicted&&clientObj.predicted.apply(clientObj.predicted,e),clientObj.prediction=e})}
