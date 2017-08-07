import MobilePreprocessor from './preprocessors/mobile';
import PromiseSupportPreprocessor from './preprocessors/promise_support';
import RegisterPreprocessor from './preprocessors/register';
import ReferrerPreprocessor from './preprocessors/referrer';
import PathCleanerPreprocessor from './preprocessors/path_cleaner';

import PagePostprocessor from './postprocessors/page';

const Processor = {
  preprocessors: [
    MobilePreprocessor,
    PromiseSupportPreprocessor,
    RegisterPreprocessor,
    ReferrerPreprocessor,
    PathCleanerPreprocessor
  ],

  postprocessors: [
    PagePostprocessor
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
