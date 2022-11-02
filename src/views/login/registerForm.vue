<template>
    <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <h1 class="title">注册</h1>
        <el-form-item prop="username">
            <el-input type="text" placeholder="请输入帐号" v-model="user.username" />
        </el-form-item>
        <el-form-item prop="phone">
            <el-input type="text" placeholder="请输入手机号" v-model="user.phone" />
        </el-form-item>
        <!-- <el-form-item prop="idcode">
            <div class="idcode">
                <el-input style="width: 72%;" type="text" placeholder="请输入验证码" v-model="user.idcode" />
                <el-button plain @click="getIdcode">获取验证码</el-button>
            </div>
        </el-form-item> -->
        <el-form-item prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="user.password" />
        </el-form-item>
        <el-form-item prop="passwordagain">
            <el-input type="password" placeholder="请再次输入密码" v-model="user.passwordagain" />
        </el-form-item>
        <el-form-item prop="agreement">
            <el-checkbox-group v-model="user.agreement">
                <el-checkbox label="我同意xxx隐私政策" name="type" />
            </el-checkbox-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="btn-login" @click="handleRegister(userForm)">注册</el-button>
        </el-form-item>
        <el-form-item>
            <el-button plain style="width: 100%;" @click="store.model = 'login'">返回</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from "element-plus"
import type { FormInstance } from 'element-plus'
import { mainStore } from "@/stores/index"
import { register } from '@/api/user'

const store = mainStore()

const userForm = ref<FormInstance>()

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (user.password !== '') {
            if (!userForm.value) return
            userForm.value.validateField('passwordagain', () => null)
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== user.password) {
        callback(new Error("两次输入密码不一致"))
    } else {
        callback()
    }
}
const user = reactive({
    username: "",
    phone: "",
    // idcode: "",
    password: "",
    passwordagain: "",
    agreement: []
})

const rules = reactive({
    username: [{ required: true, message: '请输入帐号', trigger: 'blur' }, { pattern: /^[A-Za-z0-9]{3,12}$/, message: '仅包含a-z A-Z 0-9 的3-12位的帐号', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[3456789]\d{9}$/, message: "手机号格式不正确", trigger: "blur" }],
    // idcode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    password: [{ required: true, validator: validatePass, trigger: 'blur' }, { pattern: /^[\S]{6,15}$/, message: '6-15位且中间不包含空格', trigger: 'blur' }],
    passwordagain: [{ required: true, validator: validatePass2, trigger: 'blur' }, { pattern: /^[\S]{6,15}$/, message: '6-15位且中间不包含空格', trigger: 'blur' }],
    agreement: [{ type: 'array', required: true, message: '未同意xxx协议', trigger: 'change' }],
})



const handleRegister = (userForm) => {
    userForm.validate( async (valid) => {
        if (valid) {
            let param = {
                username: user.username,
                password: user.password
            }
            const {data: res} = await register(param)
            
            if(res.status === 0) {
                ElMessage({ type: 'success', message: res.message, showClose: true, duration: 3000 })

                store.model = 'login'

            }else ElMessage({ type: 'error', message: res.message, showClose: true, duration: 3000 })

        } else ElMessage({ type: 'error', message: "注册失败", showClose: true, duration: 3000 })
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


// .idcode {
//     display: flex;
//     width: 100%;
//     justify-content: space-between;
// }
</style>