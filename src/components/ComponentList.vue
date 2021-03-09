<template>
  <div class="component-list" @dragstart="handleDragStart($event)">
    <div
      v-for="(item, index) in componentList"
      :key="index"
      class="list"
      draggable="true"
      :data-index="index">
      <span class="iconfont" :class="'icon-' + item.icon"></span>
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import componentList from '/@/custom-component/component-list'
import { reactive, toRefs, defineComponent } from 'vue'

export default defineComponent({
  setup(){
    const state = reactive({
      componentList: componentList,
    })

    function handleDragStart(e: any) {   
      e.dataTransfer.setData('componentData', JSON.stringify(state.componentList[e.target.dataset.index]))       
    }
    return {
      ...toRefs(state),
      handleDragStart,
    }
  },
})
</script>

<style lang="scss" scoped>
.component-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px;

    .list {
        width: 45%;
        border: 1px solid #ddd;
        cursor: grab;
        margin-bottom: 10px;
        text-align: center;
        color: #a2a2a2;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:active {
            cursor: grabbing;
        }

        .iconfont {
            margin-right: 4px;
            font-size: 20px;
        }

        .icon-wenben,
        .icon-tupian {
            font-size: 18px;
        }
    }
}
</style>