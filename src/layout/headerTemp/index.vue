<template>
    <div class="toolbar">
        <el-icon :size="25" @click="handleisCollapse">
            <component :is="store.isCollapse? 'Expand':'Fold'" />
        </el-icon>
        <el-breadcrumb separator="/" class="changesize">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.ptitle !== $route.meta.title">{{
            $route.meta.ptitle
            }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{
            $route.meta.title
            }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="userInfo">
        <el-dropdown class="userlink" @command="handleCommand">
            <div class="detail">
                <img :src="uStore.userinfo.data.avatar" class="eImage" />
                <span>{{ uStore.userinfo.data.nickname }}</span>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="modifyinfo">修改信息</el-dropdown-item>
                    <el-dropdown-item command="modifypwd">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出系统</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <div class="userlink userIcon">
            <el-icon>
                <Setting />
            </el-icon>
        </div>

    </div>
    <!-- 修改信息对话框 -->
    <el-dialog v-model="infoDialogVisible" title="修改信息" width="35%" center>
        <el-form ref="infoFormRef" :model="infoForm" :rules="inforules" label-width="55px" :size="formSize" status-icon>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="infoForm.nickname" />
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
                <el-upload class="avatar-uploader" ref="upload" :auto-upload="false" :show-file-list="false"
                    :on-change="handleAvatarChange" :limit="1" :on-exceed="handleExceed">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>

            <el-form-item>
                <el-button @click="infoDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitinfoForm(infoFormRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="35%" center>
        <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdrules" label-width="65px" :size="formSize" status-icon>
            <el-form-item label="原密码" prop="oldPwd">
                <el-input v-model="pwdForm.oldPwd" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model="pwdForm.newPwd" type="password" show-password />
            </el-form-item>


            <el-form-item>
                <el-button @click="pwdDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitpwdForm(pwdFormRef)">提交</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Setting, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, genFileId } from "element-plus"
import { mainStore } from "@/stores/index";
import { userStore } from "@/stores/user";
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'


import { updateUserInfo, getUserInfo, updatePassword } from '@/api/user'

const store = mainStore()
const uStore = userStore()
const infoDialogVisible = ref(false)
const pwdDialogVisible = ref(false)
// const userInfo =  reactive(uStore.userinfo.data) 



const formSize = ref('default')
const infoFormRef = ref<FormInstance>()
const pwdFormRef = ref<FormInstance>()

const infoForm = reactive({
    nickname: '',
    avatar: '',

})

const inforules = reactive<FormRules>({
    nickname: [
        { required: true, message: '请输入呢称', trigger: 'blur' },
        { min: 1, max: 12, message: '长度应为1至12位', trigger: 'blur' },
    ],
})

const pwdForm = reactive({
    oldPwd: '',
    newPwd: '',

})

const pwdrules = reactive<FormRules>({
    oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }, { pattern: /^[\S]{6,15}$/, message: '6-15位且中间不包含空格', trigger: 'blur' }],
    newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { pattern: /^[\S]{6,15}$/, message: '6-15位且中间不包含空格', trigger: 'blur' }]
})

// 头像上传

const upload = ref<UploadInstance>()
const imageUrl = ref('')

// 覆盖前一个图片
const handleExceed: UploadProps['onExceed'] = (files) => {
    console.log(files);
    upload.value.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value.handleStart(file)
}
const handleAvatarChange = (response) => {
    if (response.raw.type !== 'image/jpeg' && response.raw.type !== 'image/png' && response.raw.type !== 'image/jpg') {
        ElMessage.error('上传头像图片只能是 JPG、PNG、JPEG 格式!')
        return false
    } else if (response.raw.size / 1024 / 1024 > 2) {
        ElMessage.error('上传文件大小不能超过 2MB!')
        return false
    }
    console.log(response, 'response');
    imageUrl.value = URL.createObjectURL(response.raw)
    console.log(imageUrl.value);


    const reader = new FileReader()
    reader.readAsDataURL(response.raw)
    reader.onload = (e) => {
        console.log(e.target.result);
        infoForm.avatar = e.target.result as string
        console.log(infoForm);
    }

}




// 提交操作
const submitinfoForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (valid) {
            let param = {
                nickname: infoForm.nickname,
                avatar: infoForm.avatar
            }
            const { data: res } = await updateUserInfo(param)
            console.log(res);
            if (res.status === 0) ElMessage({ type: 'success', message: "修改成功", showClose: true, duration: 3000 })

            const { data: resl } = await getUserInfo()
            uStore.userinfo = resl

            infoDialogVisible.value = false

        } else {
            ElMessage({ type: 'error', message: "修改失败", showClose: true, duration: 3000 })
        }
    })
}


const submitpwdForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            let param = {
                oldPwd: pwdForm.oldPwd,
                newPwd: pwdForm.newPwd
            }
            const { data: res } = await updatePassword(param)
            console.log(res);
            if (res.status === 1) {
                if(res.message === '"newPwd" contains an invalid value') return ElMessage({ type: 'error', message: "新密码与原密码重复", showClose: true, duration: 3000 })
                ElMessage({ type: 'error', message: res.message, showClose: true, duration: 3000 })
            } 

            if (res.status === 0) {
                ElMessage({ type: 'success', message: "修改成功", showClose: true, duration: 3000 })
                window.localStorage.removeItem("token")
                location.reload()
            }

        } else {
            ElMessage({ type: 'error', message: "修改失败", showClose: true, duration: 3000 })
        }
    })
}


// 基础操作
const handleisCollapse = () => {
    store.isCollapse = !store.isCollapse
}
const handleCommand = async (key) => {
    if (key === "logout") {
        ElMessageBox.confirm(
            '是否确认退出系统?',
            '温馨提醒',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(() => {
                // window.localStorage.removeItem("user")
                window.localStorage.removeItem("token")
                // ElMessage({
                //     type: 'success',
                //     message: '已退出登录',
                // })
                // router.replace({ path: "/login" })
                location.reload()
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })


    }

    if (key === 'modifyinfo') {
        infoDialogVisible.value = true
        const { data: resl } = await getUserInfo()
        console.log(resl);

        infoForm.nickname = resl.data.nickname
        infoForm.avatar = resl.data.avatar
        imageUrl.value = resl.data.avatar

    }
    if (key === 'modifypwd') {
        pwdDialogVisible.value = true
    }
}

</script>

<style lang="scss" scoped>
.toolbar {
    display: flex;
    height: 100%;
    align-items: center;

    .el-breadcrumb {
        padding: 0 10px;
    }

    .el-icon {
        cursor: pointer;
    }
}

.userInfo {
    display: flex;
    align-items: center;
    height: 100%;

    .el-dropdown {
        padding: 0 10px;

        .detail {
            display: flex;
            align-items: center;
            height: 100%;
            cursor: pointer;

            .eImage {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin-right: 10px;
            }
        }
    }

}

.userIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 100%;
}

.userlink:hover {
    background-color: #f6f6f6;
}

@media (max-width:992px) {
    .changesize {
        display: none;
    }
}
</style>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
    
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>

