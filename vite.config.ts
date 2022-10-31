import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// element-plus使用按需引入，自动引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),],
  resolve: {
    // 配置项目路径别名，在开发时不需要写完整的路径名称，需要安装 @types/node，执行命令npm i -D @types/node --save-dev即可
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
          "element-plus"
      ]
    }
  }
})
