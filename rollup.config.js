import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

import pkg from './package.json';

const extensions = ['.ts', '.tsx', '.js', '.json'];

/**
 * @type {import('rollup').RollupOptions}
 */
const rollupConfig = {
  input: 'src/index.ts',
  output: [
    // CommonJS output for Node
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },

    // ESM output for build tools like Rollup and Webpack
    {
      dir: 'dist',
      format: 'esm',
      preserveModules: true,
      sourcemap: true,
    },
  ],

  plugins: [
    // Resolve require/import statements
    resolve({
      extensions,
      resolveOnly: [/^src/],
    }),

    // Transpile TypeScript to JS that can runs in all targets specified by our browserslist
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
  ],
};

export default rollupConfig;
