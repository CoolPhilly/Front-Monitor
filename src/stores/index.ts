/*
@ isCollapse 控制侧边栏伸缩
@ charts 控制Echarts伸缩
@ model 控制登录页面表单组件
*/


import { defineStore} from 'pinia'

export const mainStore = defineStore('main',{

  state:()=>({ isCollapse: false , charts: [] ,model:'login' }),
  persist: {
    storage: sessionStorage,
    paths: ['isCollapse'],
  },
  getters:{},
  actions:{},

})

