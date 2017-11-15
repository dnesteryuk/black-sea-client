import RestrictMobile from './pipes/restrict_mobile';
import RegisterSW from './pipes/register_sw';
import VerifyReferrer from './pipes/verify_referrer';
import CleanPaths from './pipes/clean_paths';
import ReadCache from './pipes/read_cache';
import GatherAssets from './pipes/gather_assets';

import Predict from './pipes/predict';
import PrefetchPage from './pipes/prefetch_page';
import PrefetchAssets from './pipes/prefetch_assets';
import WriteCache from './pipes/write_cache';
import VerifyCorrectness from './pipes/verify_correctness';

const Pipeline = {
  pipes: [
    // before prediction
    RestrictMobile,
    RegisterSW,
    VerifyReferrer,
    CleanPaths,
    ReadCache,
    GatherAssets,

    Predict,

    // after prediction
    PrefetchPage,
    PrefetchAssets,
    WriteCache,
    VerifyCorrectness // this step must be last
  ],

  /**
   * Passes given data through pipes.
   *
   * Every pipe can change the given data, so a next pipe will work with altered data.
   * Every pipe can interrupt execution by returning false.
   * Every pipe can return a promise, so a next pipe will wait for it.
   */
  call: function(reqInfo, conf) {
    let promise = Promise.resolve({request: reqInfo});

    this.pipes.forEach((pipe) => {
      promise = promise.then(function(data) {
        data = pipe.call(data, conf);
        if (!data) return Promise.reject();
        return Promise.resolve(data);
      });
    });

    return promise;
  }
};

export default Pipeline;
