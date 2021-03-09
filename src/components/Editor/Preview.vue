<template>
  <div v-if="show" class="bg">
    <el-button class="close" @click="close">关闭</el-button>
    <div class="canvas-container">
      <div
        class="canvas"
        :style="{
          width: canvasStyleData.width + 'px',
          height: canvasStyleData.height + 'px',
          transform: 'scale(' + parseInt(canvasStyleData.scale) / 100 + ')'
        }"
      >
        <ComponentWrapper
          v-for="(item, index) in componentData"
          :key="index"
          :config="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getStyle } from '/@/utils/style'
import { useStore } from 'vuex'
import ComponentWrapper from './ComponentWrapper.vue'
import { computed, defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  components: { ComponentWrapper },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits:['update:show'],
  setup(props, {emit}){
    const store = useStore()
    const state = reactive({
      componentData: computed(()=>store.state.componentData),
      canvasStyleData: computed(()=>store.state.canvasStyleData),
    })
    function close() {
      console.log('context :>> ', props)
      emit('update:show', false)
    }
    return {
      ...toRefs(state),
      close,
      getStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.bg {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    background: rgb(0, 0, 0, .5);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: 20px;

    .canvas-container {
        width: calc(100% - 40px);
        height: calc(100% - 120px);
        overflow: auto;

        .canvas {
            background: #fff;
            position: relative;
            margin: auto;
            overflow: hidden;
        }
    }

    .close {
        position: absolute;
        right: 20px;
        top: 20px;
    }
}
</style>