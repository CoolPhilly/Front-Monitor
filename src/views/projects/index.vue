<template>
    <div>
        <div class="projects-heard">
            <h1>Projects</h1>
            <el-button color="#fff" :icon="Plus" @click="handleCreateProject">Create Project</el-button>
        </div>
        <el-row :gutter="15" v-if="app.length">
            <template v-for="item in app" :key="item.appid">
                <el-col :xs="24" :sm="12" :md="8">
                    <el-card shadow="hover" class="box-card">
                        <template #header>
                            <div class="card-header">
                                <div class="card-header-left">
                                    <img src="/vue.svg" width="32" alt="">
                                    <span>{{item.appname}}</span>
                                </div>

                                <el-dropdown trigger="click" @command="handleCommand">
                                    <el-button text :icon="More"></el-button>
                                    <template #dropdown>
                                        <el-dropdown-menu>
                                            <el-dropdown-item :command="beforeHandleCommand('delete',item.appid)">删除
                                            </el-dropdown-item>

                                        </el-dropdown-menu>
                                    </template>
                                </el-dropdown>

                            </div>
                        </template>
                        <div>{{ item.appdesc }}</div>
                    </el-card>
                </el-col>
            </template>



        </el-row>

        <template v-else>
            <el-empty :image-size="200" />
        </template>




        <!-- 创建项目 -->

        <el-dialog v-model="projectDialogVisible" title="创建项目" width="35%" center>
            <el-form ref="projectFormRef" :model="projectForm" :rules="projectrules" label-width="80px" size="default"
                status-icon>
                <el-form-item label="项目ID" prop="appid">
                    <el-input v-model="projectForm.appid" />
                </el-form-item>
                <el-form-item label="项目名称" prop="appname">
                    <el-input v-model="projectForm.appname" />
                </el-form-item>
                <el-form-item label="项目描述" prop="appdesc">
                    <el-input v-model="projectForm.appdesc" type="textarea" />
                </el-form-item>

                <el-form-item>
                    <el-button @click="projectDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitprojectForm(projectFormRef)">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>



    </div>



</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { Plus, More } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from "element-plus"
import type { FormInstance, FormRules } from 'element-plus'
import { createProject, deleteProject,getProjectList } from "@/api/project";
import generateUniqueID from "@/utils/generateUniqueID";



// 获取项目列表
const app = ref([])

const getProjectListAgain = async () => {
    const {data: res} =  await getProjectList()
    app.value = res.data
}
getProjectListAgain()


// 创建项目
const projectDialogVisible = ref(false)

const projectForm = reactive({
    appid: '',
    appname: '',
    appdesc: ''

})

const projectrules = reactive<FormRules>({
    appid: [{ required: true, message: '请输入项目ID', trigger: 'blur' }, { pattern: /^[\S]{1,30}$/, message: '1-30位且中间不包含空格', trigger: 'blur' }],
    appname: [{ required: true, message: '请输入项目名称', trigger: 'blur' }, { pattern: /^[\S]{1,15}$/, message: '1-15位且中间不包含空格', trigger: 'blur' }],
    appdesc: [{ message: '请输入项目描述', trigger: 'blur' }]
})

const projectFormRef = ref<FormInstance>()
const submitprojectForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            let param = {
                appid: projectForm.appid,
                appname: projectForm.appname,
                appdesc: projectForm.appdesc
            }
            const { data: res } = await createProject(param)
            // console.log(res);

            getProjectListAgain()

            projectDialogVisible.value = false
            if(res.status === 0) ElMessage({ type: 'success', message: res.message, showClose: true, duration: 3000 })
            formEl.resetFields()


        } else {
            ElMessage({ type: 'error', message: "创建失败" })
        }
    })
}





const handleCreateProject = () => {

    projectForm.appid = generateUniqueID()
    projectDialogVisible.value = true
}


// 删除项目
const beforeHandleCommand = (command, appid) => {
    return {
        command,
        appid
    }

}

const handleCommand = async (val) => {
    if (val.command === "delete") {
        ElMessageBox.confirm(
            '是否确认删除?',
            '温馨提醒',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {

                console.log( val.appid);

                /* 
                ref 定义数据（包括对象）时，都会变成 RefImpl(Ref 引用对象) 类的实例，
                无论是修改还是重新赋值都会调用 setter，都会经过 reactive 方法处理为响应式对象。
                但是 reactive 定义数据（必须是对象），是直接调用 reactive 方法处理成响应式对象。
                如果重新赋值，就会丢失原来响应式对象的引用地址，变成一个新的引用地址，这个新的引用地址指向的对象是没有经过 reactive 方法处理的，
                所以是一个普通对象，而不是响应式对象
                */
               let param = {
                   appid: val.appid
               }
                const { data: res } = await deleteProject(param)
                if (res.status === 0) ElMessage({ type: 'success',message: '已删除'})
                getProjectListAgain()
                

            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '已取消',
                })
            })


    }

}

</script>
  

<style lang="scss" scoped>
.projects-heard {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
}

.box-card {
    width: 100%;
    margin-top: 1em;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-header-left {
            display: flex;
            align-items: center;
        }
    }
}
</style>
