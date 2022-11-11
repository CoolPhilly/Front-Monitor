import axios from 'axios';
import { ElMessage } from 'element-plus'
import router from '@/router/index'
import { userStore } from "@/stores/user";

// const router = useRouter()

const request = axios.create({
    withCredentials: true, // 异步请求携带cookie
    timeout: 50000,
    baseURL: import.meta.env.VITE_BASE_API
})
// axios的全局配置
// request.defaults.headers.post = {
//     'Content-Type': 'application/x-www-form-urlencoded'
// }
// request.defaults.headers.common = {
//     'Auth-Type': 'company-web',
//     'X-Requested-With': 'XMLHttpRequest',
// }

// 添加请求拦截器（post只能接受字符串类型数据）
request.interceptors.request.use(
    // 统一设置用户身份 token
    (config) => {
        // console.log(config);
        const token = userStore().getToken()
        // 如果用户已登录，统一给接口设置 token 信息
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 错误处理
const errorHandle = (status: any, other: any) => {
    switch (status) {
        case 400:
            ElMessage.error('信息校验失败');
            break;
        case 401:
            ElMessage.error('认证失败');
            break;
        case 403:
            ElMessage.error('token校验失败');
            break;
        case 404:
            ElMessage.error('请求资源不存在');
            break;
        default:
            ElMessage.error(other);
            break;
    }
}

// 添加响应拦截器
request.interceptors.response.use(
    (res) => {
        // console.log(res);
        
        if (res.data.status === 1 && res.data.message === '身份认证失败!') {
            ElMessage({ message: '登录信息过期,请重新登录', type: 'warning' })
            window.localStorage.removeItem("token")
            router.replace({ path: "/login" })
            // location.reload()
        }
        return res
    },
    (err) => {
        console.log(err);

        // const { response } = err;
        // if (response) {
        //     errorHandle(response.status, response.data);
        //     return Promise.reject(response);
        // }
        // ElMessage.error('请求失败' + err);
        // return true;
    }
)

export default request;
