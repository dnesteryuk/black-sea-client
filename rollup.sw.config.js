import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/sirko_sw.js',
  output: {
    file: 'dist/sirko_sw.js',
    format: 'iife'
  },
  plugins: [
    uglify()
  ]
};

