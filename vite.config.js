import { join } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: join(__dirname, '.env') })
const root = join(__dirname, 'src/render')

const config = {
  root,
  resolve: {
    alias: {
      '/@': root,
    }
  },
  base: './',
  build: {
    outDir: join('../../dist/render'),
    emptyOutDir: true
  },
  server: {
    port: +process.env.PORT,
  },
  plugins: [
  ],
  optimizeDeps: {
    exclude: [
      'electron-is-dev',
    ]
  },
}

export default config
