<template>
    <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <h1 class="title">登录</h1>
        <el-form-item prop="username">
            <el-input type="text" placeholder="请输入帐号" v-model="user.username" />
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" @keyup.enter.native="handleLogin(userForm)" v-model="user.password" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="btn-login" :loading="loading" @click="handleLogin(userForm)">{{ loading ? '登录中 ...' : '登录' }}</el-button>
        </el-form-item>
        <el-form-item>
            <div class="otherlogin">
                <el-button plain class="btn-login-x" @click="mstore.model = 'moblie'">手机登录</el-button>
                <el-button plain class="btn-login-x" @click="mstore.model = 'register'">注册</el-button>
            </div>

        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus"
import type { FormInstance } from 'element-plus'
import { login, getUserInfo } from '@/api/user'
import { mainStore } from "@/stores/index";
import { userStore } from "@/stores/user";


const mstore = mainStore()
const uStore = userStore()


const user = reactive({
    username: "",
    password: ""
})
const rules = reactive({
    username: [{ required: true, message: '请输入帐号', trigger: 'blur' }, { pattern: /^[A-Za-z0-9]{3,12}$/, message: '仅包含a-z A-Z 0-9 的3-12位的帐号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { pattern: /^[\S]{6,15}$/, message: '6-15位且中间不包含空格', trigger: 'blur' }]
})

const userForm = ref<FormInstance>()
const router = useRouter()

const loading = ref(false)
const handleLogin = (userForm) => {
    loading.value = true
    userForm.validate(async (valid) => {
        if (valid) {
            let param = {
                username: user.username,
                password: user.password
            }
            const { data: res } = await login(param)
            
            
            if (res.status === 0) {
                
                uStore.token = res.token
                uStore.setToken()
                
                // const { data: resl } = await getUserInfo()
                // uStore.userinfo = resl
                
                
                router.replace({ path: "/" })
                ElMessage({ type: 'success', message: res.message, showClose: true, duration: 3000 })

            } 
            else {
                ElMessage({ type: 'error', message: res.message, showClose: true, duration: 3000 })
                loading.value = false
            }
        } 
        else {
            ElMessage({ type: 'error', message: "登录失败", showClose: true, duration: 3000 })
            loading.value = false
        } 
    })

}

</script>

<style lang="scss" scoped>
.title {
    text-align: center;
    margin-bottom: 1%;
}

.btn-login {
    width: 100%;
    background-color: #0A61BD;
    border: none;
}

.btn-login:hover {
    width: 100%;
    background-color: #2B7EC9;
}

.otherlogin {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .btn-login-x {
        width: 50%;
    }
}
</style>