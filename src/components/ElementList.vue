<template>
  <ul class="wrap">
    <a href="javascript:void(0)">
        <li
          v-for="item,index in componentData"
          :key="index"
          class="wrap-element"
          :class="item === curComponent ? 'active':''"
          @click.self="setCurComponent(item,index)">
          <div style="display:flex;align-items:center">
            <span
              :class="item.isLock?'el-icon-lock':
              'el-icon-unlock'"
              style="margin-right: 10px;color: #fffddd"
              @click="changeLock(item)"
            ></span>
            <div>
              <p v-if="index > 0"><i class="el-icon-arrow-up" @click.self="downComponent(item,index)"></i></p>
              <p v-if="index < componentData.length - 1"><i class="el-icon-arrow-down" @click.self="upComponent(item,index)"></i></p>
            </div>
          </div>
          <!-- 组件类型 -->
          <span v-if="item.component === 'v-text'">{{item.propValue}}</span>
          <span v-if="item.component === 'Picture'">图片</span>
          <!-- 删除 -->
          <span class="el-icon-delete-solid" @click.self="delComponent(index)"></span>
        </li>      
      </a>
    
  </ul>
</template>

<script>
import { ElMessage } from "element-plus"
import { defineComponent, computed, reactive, toRefs } from "vue"
import { useStore } from "vuex"

export default defineComponent({
  setup(){
    const store = useStore()
    const state = reactive({
      componentData: computed(()=> store.state.componentData),
      curComponent: computed(() => store.state.curComponent),
    })
    function setCurComponent(component, index) {
      store.commit('setCurComponent', {component, index})
    }
    function changeLock(item) {
      item.isLock = !item.isLock
    }
    function  delComponent(index) {
      store.commit('deleteComponent', index)
    }
    // 上移--对应的组件层级下移
    function downComponent(item, index) {
      if (index === 0) {
        ElMessage.warning('^~^，无法移动')
        return
      }
      setCurComponent(item, index)
      store.commit('downComponent')
      store.commit('recordSnapshot')
    }
    // 下移-对应的组件层级上移
    function upComponent(item, index) {
      if (index === state.componentData.length - 1) {
        ElMessage.warning('^~^,无法移动')
        return
      }
      setCurComponent(item, index)
      store.commit('upComponent')
      store.commit('recordSnapshot')
    }
    return {
      ...toRefs(state),
      setCurComponent,
      changeLock,
      delComponent,
      upComponent,
      downComponent,
    }
  },
})
</script>

<style lang="scss" scoped>
  .wrap{
    width: 100%;
    height: 100%;
    text-align: left;
    a{
      outline: none;
    }
    &-element{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 60px;
      overflow: hidden;
      padding: 0 15px;
      color: #fff;
      &:hover{
        background: #333;
      }
    }
    .active{
      background: #2c2d2e;
    }
  }
</style>