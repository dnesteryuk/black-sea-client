import MobilePreprocessor from './preprocessors/mobile';
import ReferrerPreprocessor from './preprocessors/referrer';
import PathCleanerPreprocessor from './preprocessors/path_cleaner';
import HintSupportPreprocessor from './preprocessors/hint_support';
import FallbackPreprocessor from './preprocessors/fallback';

import PrerenderPostprocessor from './postprocessors/prerender';
import FallbackPostprocessor from './postprocessors/fallback';

const Processor = {
  preprocessors: [
    MobilePreprocessor,
    ReferrerPreprocessor,
    PathCleanerPreprocessor,
    HintSupportPreprocessor,
    FallbackPreprocessor
  ],

  postprocessors: [
    PrerenderPostprocessor,
    FallbackPostprocessor
  ],

  /**
   * Runs preprocessors which may change the request info or
   * tell the client to not make prediction by returning false or null.
   */
  preprocess: function(reqInfo, conf) {
    return this._runProcessors(this.preprocessors, reqInfo, conf);
  },

  /**
   * Runs postprocessors to hint the browser about the predicted page.
   */
  postprocess: function(result, conf) {
    this._runProcessors(this.postprocessors, result, conf);
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
