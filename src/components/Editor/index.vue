<template>
  <div
    id="editor"
    ref="editorEle"
    class="editor"
    :class="{ edit: isEdit }"
    :style="{
      width: canvasStyleData.width + 'px',
      height: canvasStyleData.height + 'px',
      transform: 'scale(' + parseInt(canvasStyleData.scale) / 100 + ')'
    }"
    @contextmenu="handleContextMenu"
    @mousedown="handleMouseDown"
  >
    <!-- 网格线 -->
    <Grid />

    <!--页面组件列表展示-->
    <Shape
      v-for="(item, index) in componentData"
      :key="item.id"
      :default-style="item.style"
      :style="getShapeStyle(item.style)"
      :active="item === curComponent"
      :element="item"
      :index="index"
      :class="{ lock: item.isLock }"
    >
      <component
        :is="item.component"
        v-if="item.component != 'v-text'"
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
      />

      <component
        :is="item.component"
        v-else
        :id="'component' + item.id"
        class="component"
        :style="getComponentStyle(item.style)"
        :prop-value="item.propValue"
        :element="item"
        @input="handleInput"
      />
    </Shape>
    <!-- 右击菜单 -->
    <ContextMenu />
    <!-- 标线 -->
    <MarkLine />
    <!-- 选中区域 -->
    <Area v-show="isShowArea" :start="start" :width="width" :height="height" />
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import Shape from './Shape.vue'
import { getStyle, getComponentRotatedStyle } from '/@/utils/style'
import { $ } from '/@/utils/utils'
import ContextMenu from './ContextMenu.vue'
import MarkLine from './MarkLine.vue'
import Area from './Area.vue'
import eventBus from '/@/utils/eventBus'
import Grid from './Grid.vue'
import {
  computed,
  reactive,
  toRefs,
  defineComponent,
  onMounted,
  ref
} from 'vue'

export default defineComponent({
  name: 'Editor',
  components: { ContextMenu, MarkLine, Area, Grid, Shape },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const editorEle = ref(null)
    const store = useStore()
    const state = reactive({
      editorX: 0,
      editorY: 0,
      start: {
        // 选中区域的起点
        x: 0,
        y: 0
      },
      width: 0,
      height: 0,
      isShowArea: false,
      componentData: computed(() => store.state.componentData),
      curComponent: computed(() => store.state.curComponent),
      canvasStyleData: computed(() => store.state.canvasStyleData),
      editor: computed(() => store.state.editor)
    })

    onMounted(() => {
      // 获取编辑器元素
      store.commit('getEditor')
      eventBus.on('hideArea', () => {
        hideArea()
      })
    })

    function hideArea() {
      state.isShowArea = false
      state.width = 0
      state.height = 0
    }

    function handleMouseDown(e: any) {
      // 如果没有选中组件 在画布上点击时需要调用 e.preventDefault() 防止触发 drop 事件
      if (
        !state.curComponent ||
        (state.curComponent.component != 'v-text' &&
          state.curComponent.component != 'rect-shape')
      ) {
        e.preventDefault()
      }

      hideArea()

      // 获取编辑器的位移信息，每次点击时都需要获取一次。主要是为了方便开发时调试用。
      const rectInfo = (<any>editorEle.value).getBoundingClientRect()
      state.editorX = rectInfo.x
      state.editorY = rectInfo.y

      const startX = e.clientX
      const startY = e.clientY
      state.start.x = startX - state.editorX
      state.start.y = startY - state.editorY
      // 展示选中区域
      state.isShowArea = true

      const move = (moveEvent: { clientX: number; clientY: number }) => {
        state.width = Math.abs(moveEvent.clientX - startX)
        state.height = Math.abs(moveEvent.clientY - startY)
        if (moveEvent.clientX < startX) {
          state.start.x = moveEvent.clientX - state.editorX
        }

        if (moveEvent.clientY < startY) {
          state.start.y = moveEvent.clientY - state.editorY
        }
      }

      const up = (e: any) => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)

        if (e.clientX == startX && e.clientY == startY) {
          hideArea()
          return
        }

        createGroup()
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }

    function createGroup() {
      // 获取选中区域的组件数据
      const areaData = getSelectArea()
      if (areaData.length <= 1) {
        hideArea()
        return
      }

      // 根据选中区域和区域中每个组件的位移信息来创建 Group 组件
      // 要遍历选择区域的每个组件，获取它们的 left top right bottom 信息来进行比较
      let top = Infinity,
        left = Infinity
      let right = -Infinity,
        bottom = -Infinity
      areaData.forEach(component => {
        interface Style {
          left: number
          top: number
          right: number
          bottom: number
        }
        let style: Style = {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }

        if (component.component == 'Group') {
          component.propValue.forEach((item: { id: any }) => {
            const rectInfo = $(`#component${item.id}`).getBoundingClientRect()
            style.left = rectInfo.left - state.editorX
            style.top = rectInfo.top - state.editorY
            style.right = rectInfo.right - state.editorX
            style.bottom = rectInfo.bottom - state.editorY

            if (style.left < left) left = style.left
            if (style.top < top) top = style.top
            if (style.right > right) right = style.right
            if (style.bottom > bottom) bottom = style.bottom
          })
        } else {
          style = getComponentRotatedStyle(component.style)
        }

        if (style.left < left) left = style.left
        if (style.top < top) top = style.top
        if (style.right > right) right = style.right
        if (style.bottom > bottom) bottom = style.bottom
      })

      state.start.x = left
      state.start.y = top
      state.width = right - left
      state.height = bottom - top

      // 设置选中区域位移大小信息和区域内的组件数据
      store.commit('setAreaData', {
        style: {
          left,
          top,
          width: state.width,
          height: state.height
        },
        components: areaData
      })
    }

    function getSelectArea() {
      const result: any[] = []
      // 区域起点坐标
      const { x, y } = state.start
      // 计算所有的组件数据，判断是否在选中区域内
      state.componentData.forEach(
        (component: {
          isLock: boolean
          style: { left: number; top: number; width: number; height: number }
        }) => {
          if (component.isLock) return

          const { left, top, width, height } = component.style
          if (
            x <= left &&
            y <= top &&
            left + width <= x + state.width &&
            top + height <= y + state.height
          ) {
            result.push(component)
          }
        }
      )

      // 返回在选中区域内的所有组件
      return result
    }

    function handleContextMenu(e: {
      stopPropagation: () => void
      preventDefault: () => void
      target: any
      offsetY: any
      offsetX: any
    }) {
      e.stopPropagation()
      e.preventDefault()

      // 计算菜单相对于编辑器的位移
      let target = e.target
      let top = e.offsetY
      let left = e.offsetX
      while (target instanceof SVGElement) {
        target = target.parentNode
      }

      while (!target.className.includes('editor')) {
        left += target.offsetLeft
        top += target.offsetTop
        target = target.parentNode
      }

      store.commit('showContextMenu', { top, left })
    }

    function getShapeStyle(style: { [x: string]: string }) {
      const result = {}
      ;['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
        if (attr != 'rotate') {
          result[attr] = style[attr] + 'px'
        } else {
          result['transform'] = 'rotate(' + style[attr] + 'deg)'
        }
      })

      return result
    }

    function getComponentStyle(style: object) {
      return getStyle(style, ['top', 'left', 'width', 'height', 'rotate'])
    }

    function handleInput(element: HTMLElement, value: string) {
      console.log(value)
      // 根据文本组件高度调整 shape 高度
      store.commit('setShapeStyle', {
        height: getTextareaHeight(element, value)
      })
    }

    function getTextareaHeight(element: HTMLElement, text: string) {
      let { lineHeight, fontSize, height } = element.style

      const newHeight = (text.split('<br>').length - 1) * Number(lineHeight) * Number(fontSize)
      return Number(height) > newHeight ? height : newHeight
    }

    return {
      editorEle,
      ...toRefs(state),
      hideArea,
      handleMouseDown,
      createGroup,
      getSelectArea,
      handleContextMenu,
      getShapeStyle,
      getComponentStyle,
      handleInput
    }
  }
})
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  background: #fff;
  margin: auto;

  .lock {
    opacity: 0.5;
  }
}
.edit {
  .component {
    outline: none;
    width: 100%;
    height: 100%;
  }
}
</style>
