import MobilePreprocessor from './preprocessors/mobile';
import PromiseSupportPreprocessor from './preprocessors/promise_support';
import RegisterPreprocessor from './preprocessors/register';
import ReferrerPreprocessor from './preprocessors/referrer';
import PathCleanerPreprocessor from './preprocessors/path_cleaner';
import CachePreprocessor from './preprocessors/cache';
import AssetsPreprocessor from './preprocessors/assets';

import PagePostprocessor from './postprocessors/page';
import AssetsPostprocessor from './postprocessors/assets';
import CachePostprocessor from './postprocessors/cache';
import CorrectnessPostprocessor from './postprocessors/correctness';

const Processor = {
  preprocessors: [
    MobilePreprocessor,
    PromiseSupportPreprocessor,
    RegisterPreprocessor,
    ReferrerPreprocessor,
    PathCleanerPreprocessor,
    CachePreprocessor,
    AssetsPreprocessor
  ],

  postprocessors: [
    PagePostprocessor,
    AssetsPostprocessor,
    CachePostprocessor,
    CorrectnessPostprocessor
  ],

  /**
   * Runs preprocessors which may change the request info or
   * tell the client to not make prediction by returning false or null.
   */
  preprocess: function(reqInfo, conf) {
    return this._runProcessors(this.preprocessors, reqInfo, conf);
  },

  /**
   * Runs postprocessors to hint the browser about the predicted page
   * and assets to that page.
   */
  postprocess: function(resp, reqInfo, conf) {
    return this._runProcessors(this.postprocessors, resp, reqInfo, conf);
  },

  _runProcessors: function(processors, info, conf) {
    for (let i = 0; i < processors.length; i++) {
      let processor = processors[i];

      info = processor.process(info, conf);
      if (!info) return false;
    }

    return info;
  }
};

export default Processor;
