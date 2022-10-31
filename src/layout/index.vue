<template>
  <el-container class="layout-container-demo">
    <el-aside :width=" store.isCollapse? '64px' : '200px'">
      <sideBar></sideBar>
    </el-aside>

    <el-container>
      <el-header>
        <headerTemp></headerTemp>
      </el-header>

      <el-main>
        <appMain></appMain>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import sideBar from './sideBar/index.vue'
import headerTemp from './headerTemp/index.vue'
import appMain from './appMain/index.vue'
import { mainStore } from "@/stores/index";

const store = mainStore()

</script>

<style lang="scss" scoped>
.layout-container-demo {
  height: 100%;

  .el-aside {
    background: #334157;
    transition: width 0.5s;
  }
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
main{
  background-color: #F0F2F5;
}
</style>
