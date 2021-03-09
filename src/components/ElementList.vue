<template>
  <ul class="wrap">
    <a href="javascript:void(0)">
      <li
      v-for="item in componentData"
      :key="item.id"
      class="wrap-element">
      {{item.propValue}}
    </li>
       
      </a>
    
  </ul>
</template>

<script>
import { defineComponent, computed, reactive, toRefs } from "vue"
import { useStore } from "vuex"

export default defineComponent({
  setup(){
    const store = useStore()
    const state = reactive({
      componentData: computed(()=> store.state.componentData),
    })
    console.log('componentData :>> ', state.componentData)
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
  .wrap{
    width: 100%;
    height: 100%;
    a{
      outline: none;
    }
    &-element{
      display: block;
      width: 100%;
      height: 60px;
      overflow: hidden;
      padding: 0 15px;
      color: #fff;
      line-height: 60px;
      border-bottom: 1px solid #fff;
    }
    .active{
      background: #2c2d2e;
    }
  }
</style>