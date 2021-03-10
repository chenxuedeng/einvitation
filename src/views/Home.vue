<template>
  <div class="home">
    <!-- <Toolbar /> -->
    <Top />

    <main>
      <!-- 左侧组件列表 -->
      <section class="left">
        <ComponentList />
      </section>
      <!-- 中间画布 -->
      <section class="center">
        <div
          class="content"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @mousedown="handleMouseDown"
          @mouseup="deselectCurComponent"
        >
          <Editor />
        </div>
      </section>
      <!-- 右侧属性列表 -->
      <section class="right">
        <div v-if="isClickComponent" class="right-component">
          <el-tabs  v-model="activeName" type="border-card">
            <el-tab-pane label="属性" name="attr">
                <AttrList v-if="curComponent" />
                <p v-else class="placeholder">请选择组件</p>
            </el-tab-pane>
            <el-tab-pane label="动画" name="animation">
                <AnimationList v-if="curComponent" />
                <p v-else class="placeholder">请选择组件</p>
            </el-tab-pane>
            <el-tab-pane
              label="图层"
              name="element"
              style="height: 100%;background:#404040;">
                <ElementList v-if="curComponent" />
                <p v-else class="placeholder">请选择组件</p>
            </el-tab-pane>
            
        </el-tabs>
        </div>
        <div v-else class="right-page">
          <p class="right-page-title">页面</p>
          <PageList/>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import ComponentList from '/@/components/ComponentList.vue' // 左侧列表组件
import AttrList from '/@/components/AttrList.vue' // 右侧属性列表
import AnimationList from '/@/components/AnimationList.vue' // 右侧属性列表
import ElementList from '/@/components/ElementList.vue'
import PageList from '/@/components/PageList.vue'
import Toolbar from '/@/components/Toolbar.vue'
import Top from '/@/components/Top.vue'
import Editor from '/@/components/Editor/index.vue'
import { deepCopy } from '/@/utils/utils'
import { generateEleId } from '/@/utils/generateID'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  components: { ComponentList, Toolbar, Top, Editor, AttrList, AnimationList, ElementList, PageList },
  setup() {
    const store = useStore()
    store.commit('setComponentData', store.state.page[0].layout.elements)
    const state = reactive({
      activeName: 'attr',
      reSelectAnimateIndex: undefined,
      componentData: computed(() => store.state.componentData),
      curComponent: computed(() => store.state.curComponent),
      isClickComponent: computed(() => store.state.isClickComponent),
      canvasStyleData: computed(() => store.state.canvasStyleData),
    })
    function handleDrop(e: any) {
      e.preventDefault()
      e.stopPropagation()
      const component = deepCopy(
        JSON.parse(e.dataTransfer.getData('componentData')),
      )
      component.style.top = e.offsetY
      component.style.left = e.offsetX
      component.id = generateEleId()
      store.commit('addComponent', { component })
      store.commit('recordSnapshot')
    }

    function handleDragOver(e: any) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }
    function handleMouseDown() {
      store.commit('setClickComponentStatus', false)
    }
    function deselectCurComponent() {
      store.commit('hideContextMenu')
      if (!state.isClickComponent) {
        store.commit('setCurComponent', { component: null, index: null })
      }
    }

    return {
      ...toRefs(state),
      handleDrop,
      handleDragOver,
      handleMouseDown,
      deselectCurComponent,
    }
  },
})
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
  min-width: 1200px;
  background: #212226;
  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      position: absolute;
      height: 100%;
      width: 340px;
      left: 0;
      top: 0;
      padding-top: 10px;
      background: #404040;
    }

    .right {
      position: absolute;
      height: 100%;
      right: 0;
      top: 0;
      &-component{
        width: 340px;
        height: 100%;
        background: #404040;
        ::v-deep(.el-tabs__item.is-active){
          color: #fff;
        } 
        ::v-deep(.el-tabs__item){
          color: #a2a2a2;
        }
      }
      &-page{
        width: 215px;
        height: 100%;
        background: #404040;
        float: right;
        &-title{
          height: 44px;
          line-height: 44px;
          color: #aeaeae;
          text-align: center;
          background: #333;
        }
      }
    }

    .center {
      margin-left: 200px;
      margin-right: 262px;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }
}
</style>
<style lang="scss" scoped>
  ::v-deep(.el-tabs__nav-scroll){
    padding-left: 0;
  }
  ::v-deep(.el-tabs--border-card){
    background: none;
  }
  ::v-deep(el-tabs__header is-top){
    background: none;
  }
  ::v-deep(.el-tabs--border-card>.el-tabs__header){
    background: #333;
    border-bottom: none;
  }
  ::v-deep(.el-tabs--border-card){
    border: none;
    box-shadow: none;
  }
  ::v-deep(.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active){
    color: #fff;
    background: #404040;
    border-color: #333;
    border-bottom-color: #404040;
  }
  ::v-deep(.el-tabs__item){
    &:hover{
      color: #fff !important;
    }
  }
  ::v-deep(.el-tabs--border-card>.el-tabs__content){
    padding: 0 0 15px;
  }
</style>
