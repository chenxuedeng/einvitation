<template>
  <div
    v-if="show"
    class="modal-bg"
    @click="hide">
    <div class="fadeInLeft animated modal" @click="stopPropagation">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  props:{
    show:{
      type: Boolean,
      default: false,
    },
  },
  emits:['update:show'],
  setup(props, {emit}){
    function hide() {
      emit('update:show', false)
    }

    function stopPropagation(e:MouseEvent) {
      e.stopPropagation()
    }
    return {
      hide,
      stopPropagation,
    }
  },
})
</script>

<style lang="scss" scoped>
.modal-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 1001;

    .modal {
        width: 400px;
        background: #fff;
        height: 100%;
    }
}
</style>