<template>
  <div>
    <div class="toolbar">
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">恢复</el-button>
      <el-button for="input" class="insert">插入图片</el-button>
      <input
        id="input"
        type="file"
        hidden
        @change="handleFileChange" />
      <el-button style="margin-left: 10px;" @click="preview">预览</el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <!-- <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button> -->
      <!-- <el-button
        :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'" 
        @click="decompose"
      >
        拆分
      </el-button> -->
            
      <el-button :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</el-button>
      <el-button :disabled="!curComponent || !curComponent.isLock" @click="unlock">解锁</el-button>
      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width">
        <span>*</span>
        <input v-model="canvasStyleData.height">
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="canvasStyleData.scale"> %
      </div>
    </div>

    <!-- 预览 -->
    <Preview v-model:show="isShowPreview" />
  </div>
</template>

<script lang="ts">
import { commonStyle, commonAttr } from '/@/custom-component/component-list'
import { computed, onBeforeMount, reactive, toRefs } from 'vue'
import {generateEleId} from '/@/utils/generateID'
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
      eventBus.on('clearCanvas', clearCanvas)
    })
    
    function lock() {
      store.commit('lock')
    }

    function unlock() {
      store.commit('unlock')
    }

    function compose() {
      store.commit('compose')
      store.commit('recordSnapshot')
    }

    function decompose() {
      store.commit('decompose')
      store.commit('recordSnapshot')
    }
        
    function undo() {
      store.commit('undo')
    }

    function redo() {
      store.commit('redo')
    }

    function handleFileChange(e) {
      const file = e.target.files[0]
      if (!file.type.includes('image')) {
        return
      }

      const reader = new FileReader()
      reader.onload = (res) => {
        const fileResult = res.target.result
        const img = new Image()
        img.onload = () => {
          store.commit('addComponent', {
            component: {
              ...commonAttr,
              id: generateEleId(),
              component: 'Picture', 
              label: '图片', 
              icon: '',
              propValue: fileResult,
              style: {
                ...commonStyle,
                top: 0,
                left: 0,
                width: img.width,
                height: img.height,
              },
            },
          })

          store.commit('recordSnapshot')
        }

        img.src = fileResult
      }

      reader.readAsDataURL(file)
    }

    function preview() {
      state.isShowPreview = true
      store.commit('setEditMode', 'preview')
    }

    function save() {
      localStorage.setItem('canvasData', JSON.stringify(state.componentData))
      localStorage.setItem('canvasStyle', JSON.stringify(state.canvasStyleData))
      ElMessage.success('保存成功')
    }

    function clearCanvas() {
      store.commit('setComponentData', [])
      store.commit('recordSnapshot')
    }

    function handlePreviewChange() {
      store.commit('setEditMode', 'edit')
    }
    return {
      ...toRefs(state),
      lock,
      unlock,
      compose,
      decompose,
      undo,
      redo,
      handleFileChange,
      preview,
      save,
      clearCanvas,
      handlePreviewChange,
    }
  },

}

</script>

<style lang="scss" scoped>
.toolbar {
    height: 50px;
    line-height: 50px;
    background: #0f0f0f;
    border-bottom: 1px solid #ddd;

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