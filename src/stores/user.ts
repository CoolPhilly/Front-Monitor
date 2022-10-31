import { defineStore} from 'pinia'

// 用插件进行持久化存储token是不行的因为插件是响应式的
export const userStore = defineStore('user',{

    state:()=>({ token:'' ,userinfo: null }),
    // persist: {
    //   storage: localStorage,
    //   // paths: [ 'userinfo'],
    // },
    getters:{},

    actions:{
      setToken() {
        window.localStorage.setItem('token', this.token)
      },
      getToken() {
        return window.localStorage.getItem('token')
      }
    }, 
  
  })
  