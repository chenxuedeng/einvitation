<template>
  <div ref="el" @click="handleClick">
    <component
      :is="config.component"
      class="component"
      :style="getStyle(config.style)"
      :prop-value="config.propValue"
      :element="config"
    />
  </div>
</template>

<script lang="ts">
import { getStyle } from '/@/utils/style'
import runAnimation from '/@/utils/runAnimation'
import { mixins } from '/@/utils/events'
import { defineComponent, onMounted, reactive, getCurrentInstance, toRefs } from 'vue'

export default defineComponent({
  props: {
    config: {
      type: Object,
      require: true,
      default: ()=>{
        return {
          component: '',
        }
      },
    },
  },
  setup(props){
    const state = reactive({
      currentInstance: getCurrentInstance(),
      events : mixins.methods,
    })
    onMounted(()=>{
      const el = state.currentInstance?.refs.el
      const $el: HTMLEmbedElement | unknown = el.children[0] ? el.children[0] : el
      runAnimation(($el as HTMLEmbedElement), props.config)
    })

    function handleClick() {
      const propsEvents = props.config.events
      Object.keys(propsEvents).forEach(event => {
        state.events[event](propsEvents[event])
      })
    }
    return {
      ...toRefs(state),
      getStyle,
      handleClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.component {
    position: absolute;
}
</style>