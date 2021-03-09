<template>
  <div class="wrap">
    <div class="wrap-top">
      <div
        v-for="(pageItem,index) in pages"
        :key="pageItem.pageId"
        class="page-wrap"
        @click="selectPage(index)">
        <div class="page" >
          <ComponentWrapper
            v-for="componentItem in pageItem.layout.elements"
            :key="componentItem.id"
            :config="componentItem"
          />
        </div>
        <p class="page-wrap-bottom">{{pageItem.pageId}}</p>
      </div>
    </div>
    <section class="wrap-bottom" @click="addPage">
      +
    </section>
    
  </div>
</template>

<script>
import { computed, defineComponent, reactive, toRefs } from "vue"
import { useStore } from "vuex"
import ComponentWrapper from '/@/components/Editor/ComponentWrapper.vue'
import { generatePageId } from '/@/utils/generateID'

export default defineComponent({
  components:{
    ComponentWrapper,
  },
  setup(){
    const store = useStore()
    const state = reactive({
      pages: computed(()=> store.state.page),
      componentData: computed(()=> store.state.componentData),
    })
    function  addPage() {
      const pageData = {
        "coverPath": "",
        "pageId": generatePageId(),
        "isCheckTurn": false,
        "layout": {
          "background": "",
          "elements": [],
          "height": 0,
        },
        "nextTurn": {
          "turnAutoSecond": "0",
          "turnSecond": "500",
          "turnType": "horizontal-exit",
        },
        "pageType": 1,
        "preTurn": {
          "turnAutoSecond": "",
          "turnSecond": "1300",
          "turnType": "horizontal-exit",
        },
      }
      const index = store.state.currentPageIndex + 1
      store.commit('addPage', {pageData, index})
      console.log('state.page :>> ', state.pages)
    }
    function selectPage(index) {
      store.commit('setCurrentPageIndex', index)
      store.commit('setComponentData', state.pages[store.state.currentPageIndex].layout.elements)
      
    }
    return { 
      ...toRefs(state),
      addPage,
      selectPage,
    }
  },
})
</script>

<style lang="scss" scoped>
.wrap{
  color: #fff;
  height: 100%;
  &-top{
    height: calc(100% - 100px);
    overflow-y: auto;
  }
  &-bottom{
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 24px;
    background:rgba($color: #000000, $alpha: 0.3);
    cursor: pointer;
  }
  .page-wrap{
    position: relative;  
    width: 158px;
    height: 234px;  
    margin: 0 auto 5px;
    background: red;
    .page{
      width: 375px;
      height: 667px;
      background: #fff;
      transform: scale(0.35);
      position: absolute;
      top: -217px;
      left: -110px;
      cursor: pointer;
      color: red;
      :hover{
        border: 1px solid #fff
      }
    }
    &-bottom{
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background: rgba($color: #000000, $alpha: 0.5);
      position: absolute;
      bottom: 0;
    }
  }
  
  
}
</style>