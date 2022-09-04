import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    port: 10000
  },
  define:{
    'process.env.NODE_ENV':"'production'"
  },
  build:{
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'singleVue',
      formats: ['umd'],
    },
    sourcemap: true
  },
  
  
})
