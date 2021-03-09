<template>
  <div>
    <div class="toolbar">
      <h1 class="logo"> 婚奢汇 </h1>
      <div class="worktitle">
        <input type="text" value="婚奢汇"/>
      </div>
      <div class="toolbar-right">
          <a href="javascript:void(0)" @click="preview">
            <i class="el-icon-view"></i>
            <span>预览</span>
          </a>
          <a href="javascript:void(0)" @click="save">
            <i class="el-icon-folder-checked"></i>
            <span>保存</span>
          </a>
          <a
            href="javascript:void(0)"
            class="publish"
            @click="publish">
            <i class="el-icon-s-promotion"></i>
            <span>发布</span>
          </a>
          <div style="width: 240px"></div>
      </div>
    </div>
    <Preview v-model:show="isShowPreview" />
  </div>
</template>

<script lang="ts">
import { computed, onBeforeMount, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import eventBus from '/@/utils/eventBus'
import Preview from '/@/components/Editor/Preview.vue'
import { ElMessage } from 'element-plus'

export default {
  name:'Toolbar',
  components:{ Preview },
  setup(){
    const store = useStore()
    const state = reactive({
      isShowPreview: false,
      componentData: computed(()=>store.state.componentData),
      canvasStyleData: computed(()=>store.state.canvasStyleData),
      areaData: computed(()=>store.state.areaData),
      curComponent: computed(()=>store.state.curComponent),
    })

    onBeforeMount(()=>{
      eventBus.on('preview', preview)
      eventBus.on('save', save)
    })

    function preview() {
      state.isShowPreview = true
      store.commit('setEditMode', 'preview')
    }

    function save() {
      localStorage.setItem('canvasData', JSON.stringify(state.componentData))
      localStorage.setItem('canvasStyle', JSON.stringify(state.canvasStyleData))
      ElMessage.success('保存成功')
    }

    function publish() {
      console.log('publish :>> ', '发布')
    }
    return {
      ...toRefs(state),
      preview,
      save,
      publish,
    }
  },

}

</script>

<style lang="scss" scoped>
.toolbar {
    height: 50px;
    background: #0f0f0f;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-width: 1200px;
    .logo{
      width: 450px;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #fff;
      letter-spacing: 5px;
    }
    .worktitle{
      width: 280px;
      height: 30px;
      margin-top: 10px;
      border-radius: 4px;
      background: #303132;
      padding: 0 10px;
      input{
        display: block;
        width: 100%;
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        border: 0;
        background: #303132;
        border-radius: 4px;
        font-size: 12px;
        color: #ccc;
        outline: none;
        text-overflow: ellipsis;
        text-align: center;
      }
    }
    &-right{
      display: flex;
      color: #aeaeae;
      line-height: 50px;
      margin-left: 100px;
      .publish{
        width: 90px;
        height: 28px;
        line-height: 28px;
        margin: 11px 3.125% 0 0;
        background: #1bceb3;
        color: #fff;
        font-size: 14px;
        text-align: center;
        border-radius: 2px;
        &:hover{
          background: #1ee5c7;
        }
      }

      a{
        width: 60px;
        margin-right: 40px;
        color: #aeaeae;
        font-size: 14px;
        i{
          margin-right: 8px;
        }
      }
    }
    .canvas-config {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
        color: #606266;

        input {
            width: 50px;
            margin-left: 10px;
            outline: none;
            padding: 0 5px;
            border: 1px solid #ddd;
            color: #606266;
        }

        span {
            margin-left: 10px;
        }
    }

    .insert {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #FFF;
        border: 1px solid #DCDFE6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        margin-left: 10px;

        &:active {
            color: #3a8ee6;
            border-color: #3a8ee6;
            outline: 0;
        }

        &:hover {
            background-color: #ecf5ff;
            color: #3a8ee6;
        }
    }
}
</style>