<template>
  <el-container>   
    <el-header style="padding: 0;">
      <top />
    </el-header>
    <el-container style="height: calc(100vh-60px);">
      <el-aside width="200px">
        <sidebar />
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue"
import top from './top/index.vue'
import sidebar from './sidebar/index.vue'
import { useRoute } from "vue-router"

export default defineComponent({
  components:{
    top,
    sidebar,
  },
  setup(){
    const state = reactive({
      route: useRoute(),
    })

    return toRefs({
      ...state,
    })
  },
})
</script>

<style lang="scss" scoped>

</style>