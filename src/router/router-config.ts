import router from "./index"
import Layout from "@/layout/index.vue"
import { getUserInfo } from '@/api/user'
import { userStore } from "@/stores/user";

let registerRouteFresh = true //记录路由是否已经添加
const filterRoutes = ["/login"]   // 需要过滤掉的路由,不用登陆可以直接访问
router.beforeEach(async (to, from, next) => {

    // 获取路由 meta 中的title，并设置给页面标题
    document.title = to.meta.title + " - Front Monitor"
    // 判断路由指向是否在需要过滤的路由地址数组里
    // 如果在，则直接跳进页面，无需判断
    if (filterRoutes.indexOf(to.path) !== -1) return next()
    if (registerRouteFresh) {
        // 获取token和原始路由数组
        let userRoutes = null
        const { data: resl } = await getUserInfo()
        userStore().userinfo = resl
        resl.data ? userRoutes = resl.data.routes  : userRoutes = []
        
        const token = userStore().getToken() || ""

        // 当token和原始路由都存在的时候
        if (token && userRoutes) onFilterRoutes(to, next, userRoutes)  // 执行路由过滤和跳转

        else next({ path: "/login", replace: true })
    } else next()
})


// 路由拼接
function loadView(view) {
    let modules = import.meta.glob('../views/**/*.vue')
    // 然后动态路由的时候这样来取
    return modules['../views' + view + '.vue']

}

// 路由过滤和跳转
async function onFilterRoutes(to, next, e) {

    const routes = await filterASyncRoutes(e)    // 路由过滤
    // console.log(router);

    routes.sort((a, b) => a['id'] - b['id'])
    routes.forEach(item => {
        // router.options.routes.push(item)
        router.addRoute(item)
    })
    /*
    如果首次或者刷新界面，next(...to, replace: true)会循环遍历路由
    如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由
    我们的问题在于页面刷新以后异步获取数据，直接执行next()感觉路由添加了但是在next()之后执行的，所以我们没法导航到相应的界面。
    这里使用变量registerRouteFresh变量做记录，直到找到相应的路由以后，把值设置为false然后走else执行next(),整个流程就走完了，路由也就添加完了。
    */


    /*
    判断要去的路由是404，且来源的路由不等于空。则跳转到来源路由，反之则跳转到要去的路由。
    因为设置了全路由匹配。一开始访问动态路由肯定会去404. 那么在添加完动态路由后，再回到之前的路由即可。
    后面这个to.redirectedFrom != undefined 主要是为了防止直接访问404路由导致空白页的问题。
    */
    if (to.path === '/404' && to.redirectedFrom != undefined) {
        // console.log(to)
        next({ path: to.redirectedFrom.fullPath, replace: true })
    } else {
        next({ ...to, replace: true })
    }
    // next({ ...to, replace: true })
    registerRouteFresh = false
}

// 路由过滤   遍历路由 转换为组件对象和路径
function filterASyncRoutes(data) {
    const routes = data.filter(item => {
        if (item["component"] === "Layout") item.component = Layout
        else item["component"] = loadView(item["component"])
        // 路由递归，转换组件对象和路径
        if (item["children"] && item["children"].length > 0) item["children"] = filterASyncRoutes(item.children)
        return true
    })
    // console.log(routes,'filterASyncRoutes');
    return routes
}