interface PageData {
  pageData: object
  index?: number
}
interface State {
  page: Array<object>
  currentPageIndex: number
}
import { ElMessage } from 'element-plus'
import { swap } from '/@/utils/utils'
export default { 
  state: {
    page: [
      {
        "coverPath": "https://qnm.hunliji.com/o_1dtut5d3v1u24fq1c9mg413sc2k.jpg",
        "pageId": 473746935,
        "isCheckTurn": true,
        "layout": {
          "background": "https://qnm.hunliji.com/o_1dti595db16921v43m4h13se1sa53p.png",
          "elements": [],
          "height": 1220,
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
      },
    ],
    currentPageIndex: 0,
  },
  mutations:{
    addPage(state:State, {pageData, index}:PageData){
      const i = index ?? state.page.length
      state.page.splice(i, 0, pageData)
    },
    setCurrentPageIndex(state:State, index: number){      
      state.currentPageIndex = index      
    },
    upPage(state:State, index:number){
      if (index === 0) {
        return
      }
      swap(state.page, index, index-1)
    },
    downPage(state:State, index:number){
      if (index >= state.page.length - 1) {
        return
      }
      swap(state.page, index, index+1)
    },
  },
}