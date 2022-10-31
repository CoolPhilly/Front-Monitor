<template>
    <template v-for="item in routes" :key="item.id">
        <router-link v-if="item.children.length === 1" :to="item.children[0].path">
            <el-menu-item :index="item.children[0].path">
                <el-icon>
                    <component :is="item.children[0].meta.icon"/>
                </el-icon>
                <template #title v-if="item.children[0].meta && item.children[0].meta.title">{{ item.children[0].meta.title
                }}</template>
            </el-menu-item>
        </router-link>

        <el-sub-menu v-else :index="item.path">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"/>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <template v-for="child in item.children ">
                <router-link :to="child.path">
                    <el-menu-item :index="child.path">
                        <span>{{ child.meta.title }}</span>
                    </el-menu-item>
                </router-link>
            </template>
        </el-sub-menu>
    </template>
</template>


  
<script lang="ts" setup>

defineProps(['routes'])

</script>
<style lang="scss" scoped>
</style>