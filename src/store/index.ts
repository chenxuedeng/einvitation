import { createStore, createLogger  } from 'vuex'
import compose from './compose'
import animation from './animation'
import contextmenu from './contextmenu'
import copy from './copy'
import event from './event'
import layer from './layer'
import snapshot from './snapshot'
import lock from './lock'
import page from './page'

const store = createStore({
  state() {
    return {
      ...compose.state,
      ...contextmenu.state,
      ...copy.state,
      ...snapshot.state,
      ...page.state,
      // 编辑器模式 edit preview
      editMode: 'edit', 
      // 页面全局数据
      canvasStyleData: { 
        width: 375,
        height: 667,
        scale: 100,
      },
      // 画布组件数据
      componentData: [], 
      curComponent: null,
      curComponentIndex: null,
      // 点击画布时是否点中组件，主要用于取消选中组件用。
      // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
      isClickComponent: false,
    }
  },
  mutations: {
    ...compose.mutations,
    ...animation.mutations,
    ...contextmenu.mutations,
    ...copy.mutations,
    ...event.mutations,
    ...layer.mutations,
    ...snapshot.mutations,
    ...lock.mutations,
    ...page.mutations,
    setClickComponentStatus(state, status) {
      state.isClickComponent = status
    },
    // 设置组件是否可编辑
    setEditMode(state, mode) {
      state.editMode = mode
    },

    setCanvasStyle(state, style) {
      state.canvasStyleData = style
    },
    // 设置组件选中（组件和下标）
    setCurComponent(state, { component, index }) {
      state.curComponent = component
      state.curComponentIndex = index
    },
    // 组件编辑
    setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
      if (top) curComponent.style.top = top
      if (left) curComponent.style.left = left
      if (width) curComponent.style.width = width
      if (height) curComponent.style.height = height
      if (rotate) curComponent.style.rotate = rotate
    },

    setShapeSingleStyle({ curComponent }, { key, value }) {
      curComponent.style[key] = value
    },

    // 设置组件数据
    setComponentData(state, componentData = []) {
      state.componentData = componentData
      // 设置右侧页面数据      
      state.page[state.currentPageIndex].layout.elements = componentData
    },
    // 添加组件
    addComponent(state, { component, index }) {
      console.log(state.currentPageIndex)
      
      if (index !== undefined) {
        state.componentData.splice(index, 0, component)
      } else {
        state.componentData.push(component)
      }
      state.page[state.currentPageIndex].layout.elements = state.componentData
    },
    // 删除组件
    deleteComponent(state, index) {
      if (index === undefined) {
        index = state.curComponentIndex
      }

      state.componentData.splice(index, 1)
      state.page[state.currentPageIndex].layout.elements = state.componentData
    },
  },
})

export default store