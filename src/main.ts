import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Tracker from 'front-monitor-sdk'


import "@/assets/css/index.scss"
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //pinia数据持久化插件
import '@/router/router-config'  // 路由守卫，做动态路由的地方

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(pinia)
app.use(router)

console.log(new Tracker);

new Tracker({
  appid: 'v2-1667353824685-1146960441358',
  userbehavior: true, //用户行为上报
  // isImmediate:true,
  baseError: true,
  performance: true,
  requestUrl: "http://1.15.172.157:3000/api/tracker", //接口地址
  extra: {
    vue: app,
  }
}
)

app.mount('#app')

