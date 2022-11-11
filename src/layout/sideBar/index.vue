<template>
  <el-scrollbar>
    <el-menu :default-active="$route.path" background-color="#334157" text-color="#fff" router unique-opened :collapse="store.isCollapse" :collapse-transition="false">
      <div :class="[store.isCollapse ? 'logochange' : 'logo']">
        <img src="/vite.svg" />
        <span>Front Monitor</span>
      </div>
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>



<script lang="ts" setup>
import { reactive } from 'vue'
import sidebarItem from "./sidebarItem.vue";
import { mainStore } from "@/stores/index";
import { userStore } from "@/stores/user";

const store = mainStore()
const uStore = userStore()

const routes = reactive(uStore.userinfo.data.routes)


</script>
<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  padding: 15px 0 15px 7px;

  img {
    width: 32px;
  }

  span {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    padding-left: 5px;
    white-space: nowrap;
  }
}
.logochange {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px  7px;

  img {
    width: 32px;
  }

  span {
    display: none;
  }
}
.el-menu {
  //去掉菜单栏右边多出一像素的线条
  border-right: none;
}
</style>