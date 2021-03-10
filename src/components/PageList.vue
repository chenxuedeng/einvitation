<template>
  <div class="wrap">
    <div class="wrap-top">
      <div
        v-for="(pageItem,index) in pages"
        :key="pageItem.pageId"
        class="page-wrap"
        @mouseenter="pageItem.isActive = true"
        @mouseout="pageItem.isActive = false"
        >
        <div class="page" >
          <div class="page-component" @click="selectPage(index)">
            <ComponentWrapper
              v-for="componentItem in pageItem.layout.elements"
              :key="componentItem.id"
              :config="componentItem"            
            />
          </div>
          <p class="page-wrap-bottom">
            <i class="el-icon-document-copy" @click.self="copyPage($event,pageItem,index)"></i>
            <i class="el-icon-delete" @click.self="deltePage($event,index)"></i>
          </p>        
        </div>
        <!-- 上移下移 -->
        <div class="move-wrap">
          <span class="el-icon-top" @click.self="upPage($event,index)"></span>
          <span class="index">{{Number(index) + 1}}</span>
          <span class="el-icon-bottom" @click.self="downPage($event,index)"></span>
        </div>        
      </div>
    </div>
    <section class="wrap-bottom" @click="addPage">
      +
    </section>
    
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from "element-plus"
import { defineComponent, reactive, toRefs, watch } from "vue"
import { useStore } from "vuex"
import { deepCopy } from "../utils/utils"
import ComponentWrapper from '/@/components/Editor/ComponentWrapper.vue'
import { generatePageId } from '/@/utils/generateID'

export default defineComponent({
  components:{
    ComponentWrapper,
  },
  setup(){
    const store = useStore()
    
    const state = reactive({
      pages: store.state.page,
      componentData: store.state.componentData,
    })
    watch(
      state.pages,
      (newValue)=>{
        if (newValue.length === 1) {          
          selectPage(0)
        }
      },
    )
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
    }
    function selectPage(index:number|string) {
      store.commit('setCurrentPageIndex', index)
      store.commit('setComponentData', state.pages[store.state.currentPageIndex].layout.elements)
      
    }
    function deltePage(e:MouseEvent, index:number|string) {
      e.stopPropagation()
      if (state.pages.length === 1) {
        ElMessage.warning('至少保留一页')
        return
      }
      ElMessageBox.confirm('确认删除该页面吗？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      })
        .then(() => {
          state.pages.splice(index, 1)
          console.log('store.state.currentPage :>> ', store.state.currentPageIndex)
          if (index === store.state.currentPageIndex) {
            selectPage(0)
          }
        })  
         
    }
    function copyPage(e:MouseEvent, pageItem:object, index:number|string) {
      e.stopPropagation()
      const pageData = deepCopy(pageItem)
      if (pageData) {
        store.commit('addPage', {pageData, index})
      }      
    }

    function upPage(e:MouseEvent, index:number) {
      if (index === 0) {
        ElMessage.warning('已经是第一页了')
        return
      }
      e.stopPropagation()
      store.commit('upPage', index)
    }
    function downPage(e:MouseEvent, index:number) {
      if (index >= state.pages.length - 1) {
        ElMessage.warning('没有下一页了')
        return
      }
      e.stopPropagation()
      store.commit('downPage', index)
    }
    return { 
      ...toRefs(state),
      addPage,
      selectPage,
      deltePage,
      copyPage,
      upPage,
      downPage,
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
    padding: 15px 0 0 0;
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
    width: 100%;
    height: 234px;  
    margin: 0 auto 5px;
    // background: red;
    display: flex;
    .page{
      order: 2;
      width: 158px;
      &-component{
        width: 375px;
        height: 667px;
        background: #fff;
        transform: scale(0.35);
        position: absolute;
        top: -216px;
        left: -75px;
        cursor: pointer;
        overflow: hidden;
        :hover{
          border: 1px solid #fff
        }
      }
    }
    &-bottom{
      visibility: hidden;
      width: calc(375px*0.35);
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background: rgba($color: #000000, $alpha: 0.5);
      position: absolute;
      bottom: 0;
      left: 47px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      i{
        cursor: pointer;
      }
    }
    .move-wrap{
      width: 40px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      order: 1;
      span{
        cursor: pointer;
      }
      span:hover{
        color: #1bceb3;
      }
      .index{
        cursor: inherit;
        margin: 10px 0;
        &:hover{
          color: inherit;
        }
      }
    }
  }
  .page-wrap:hover .page-wrap-bottom{
    visibility: visible;
  }
  
  
}
</style>