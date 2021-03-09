<template>
  <div
    v-if="editMode === 'edit'"
    class="v-text"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div
        ref="text"
      :contenteditable="canEdit"
      :class="{ canEdit }"
      :tabindex="element.id"
      :style="{ verticalAlign: element.style.verticalAlign }"
      @dblclick="setEdit"
      @paste="clearStyle"
      @mousedown="handleMousedown"
      @blur="handleBlur"
      @input="handleInput"
      v-html="element.propValue"
    ></div>
  </div>
  <div v-else class="v-text">
    <div
      :style="{ verticalAlign: element.style.verticalAlign }"
      v-html="element.propValue"
    ></div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { keycodes } from '/@/utils/shortcutKey'

export default defineComponent({
  props: {
    propValue: {
      type: String,
      require: true,
      default: () => '',
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const store = useStore()
    const state = reactive({
      canEdit: false,
      ctrlKey: 17,
      isCtrlDown: false,
      editMode: computed(() => store.state.editMode),
    })

    function handleInput(e) {
      emit('input', props.element, e.target.innerHTML)
    }

    function handleKeydown(e) {
      if (e.keyCode == state.ctrlKey) {
        state.isCtrlDown = true
      } else if (
        state.isCtrlDown &&
          state.canEdit &&
          keycodes.includes(e.keyCode)
      ) {
        e.stopPropagation()
      } else if (e.keyCode == 46) {
        // deleteKey
        e.stopPropagation()
      }
    }

    function handleKeyup(e) {
      if (e.keyCode == state.ctrlKey) {
        state.isCtrlDown = false
      }
    }

    function handleMousedown(e) {
      if (state.canEdit) {
        e.stopPropagation()
      }
    }

    function clearStyle(e) {
      e.preventDefault()
      const clp = e.clipboardData
      const text = clp.getData('text/plain') || ''
      if (text !== '') {
        document.execCommand('insertText', false, text)
      }

      emit('input', props.element, e.target.innerHTML)
    }

    function handleBlur(e) {
      // console.log(props.element)
      // state.element.propValue = e.target.innerHTML || '&nbsp;'
      state.canEdit = false
    }

    function setEdit() {
      state.canEdit = true
      // 全选
      selectText(this.$refs.text)
    }

    function selectText(element) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(element)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    return {
      ...toRefs(state),
      handleInput,
      handleKeydown,
      handleKeyup,
      handleMousedown,
      clearStyle,
      handleBlur,
      setEdit,
      selectText,
    }
  },
})
</script>

<style lang="scss" scoped>
.v-text {
  width: 100%;
  height: 100%;
  display: table;

  div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
  }

  .canEdit {
    cursor: text;
    height: 100%;
  }
}
</style>
