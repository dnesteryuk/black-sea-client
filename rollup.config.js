import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/sirko.js',
  output: {
    file: 'dist/sirko.js',
    format: 'iife',
    name: 'Sirko'
  },
  plugins: [
    resolve(),
    commonjs(),
    buble(),
    terser()
  ]
};
