import fs from 'fs'
import path from 'path'
import ts from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

let hasTSChecked = false

const input = path.resolve(__dirname, 'src/index.ts')

const formats = [
  {
    format: 'cjs',
    env: 'development',
  },
  {
    format: 'cjs',
    env: 'production',
  },
  {
    format: 'esm',
  },
]

const tsPlugin = ts({
  check: !hasTSChecked,
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
})

hasTSChecked = true

const config = {
  input,
  external: id => !id.startsWith('.') && !path.isAbsolute(id),
  output: formats.map(opts => ({
    // Set filenames of the consumer's package
    file: path.resolve(
      __dirname,
      'dist',
      [
        'core',
        opts.format,
        opts.env,
        opts.env === 'production' ? 'min' : '',
        'js',
      ]
        .filter(Boolean)
        .join('.'),
    ),
    // Pass through the file format
    format: opts.format,
    // Do not let Rollup call Object.freeze() on namespace import objects
    // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
    esModule: true,
    freeze: false,
    sourcemap: true,
    exports: 'named',
    plugins: [
      opts.env === 'production' &&
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 5,
          toplevel: opts.format === 'cjs',
          warnings: true,
        }),
    ],
  })),
  plugins: [
    tsPlugin,
    resolve(),
    commonjs(),
    {
      name: 'create-entry',
      generateBundle() {
        if (!fs.existsSync(path.resolve(__dirname, 'dist'))) {
          fs.mkdirSync(path.resolve(__dirname, 'dist'))
        }
        fs.writeFileSync(
          path.resolve(__dirname, 'dist/index.js'),
          "'use strict';\n" +
            "if (process.env.NODE_ENV === 'production') {\n" +
            "  module.exports = require('./core.cjs.production.min.js');\n" +
            '} else {\n' +
            "  module.exports = require('./core.cjs.development.js');\n" +
            '}\n',
        )
      },
    },
  ],
}

export default config
