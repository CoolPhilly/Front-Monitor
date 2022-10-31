<template>
    <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <h1 class="title">手机登录</h1>
        <el-form-item prop="phone">
            <el-input type="text" placeholder="请输入手机号" v-model="user.phone" />
        </el-form-item>
        <el-form-item prop="idcode">
            <div class="idcode">
                <el-input style="width: 72%;" type="text" placeholder="请输入验证码" v-model="user.idcode" />
                <el-button plain @click="getIdcode">获取验证码</el-button>
            </div>

        </el-form-item>
        <el-form-item>
            <el-button type="primary" class="btn-login" @click="login(userForm)">登录</el-button>
        </el-form-item>
        <el-form-item>
            <el-button plain style="width: 100%;" @click="store.model = 'login'">返回</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from "element-plus"
import type { FormInstance } from 'element-plus'
import { mainStore } from "@/stores/index";

const store = mainStore()

const user = reactive({
    phone: "",
    idcode: ""
})
const rules = reactive({
    username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
})

const userForm = ref<FormInstance>()
const router = useRouter()

const login = (userForm) => {
    console.log(userForm);

    // userForm.validate((valid) => {
    //     if (valid) {
    //         let flag = !1
    //         window.localStorage.removeItem("userInfo")
    //         dynamicUser.forEach(item => {
    //             if (item["username"] == user['username'] && item["password"] == user['password']) {
    //                 flag = !0
    //                 ElMessage({ type: 'success', message: "登录成功", showClose: true, duration: 3000 })
    //                 window.localStorage.setItem("userInfo", JSON.stringify(item))
    //                 router.replace({ path: "/" })
    //             }
    //         })
    //         if (!flag) ElMessage({ type: 'warning', message: "帐号密码错误，请重试!", showClose: true, duration: 3000 })
    //     } else return false
    // })
}
const getIdcode = () => {
    console.log('getIdcode');

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

.idcode {
    display: flex;
    width: 100%;
    justify-content: space-between;


}
</style>