import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      name: 'intl-dateformat',
      format: 'umd',
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.release.json',
      typescript: require('typescript')
    })
  ]
}
