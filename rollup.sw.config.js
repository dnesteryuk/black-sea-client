import uglify from 'rollup-plugin-uglify';
import conf from './rollup.config';

conf.input = 'src/sirko_sw.js';
conf.output.file = 'dist/sirko_sw.js';

export default conf;

