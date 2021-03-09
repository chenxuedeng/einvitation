<template>
  <div class="mark-line">
    <div 
      v-for="(line,index) in lines"
      v-show="lineStatus[line] || false"
      :key="line"
      :ref="(el)=>setItemRef(el,index)"
      class="line"
      :class="line.includes('x')? 'xline' : 'yline'"
    ></div>
  </div>
</template>

<script lang="ts">
import eventBus from '/@/utils/eventBus'
import { useStore } from 'vuex'
import { getComponentRotatedStyle } from '/@/utils/style'
import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue'

export default defineComponent({
  name: 'MarkLine',
  
  setup() {    
    const store = useStore()
    const state = reactive({
      lines: ['xt', 'xc', 'xb', 'yl', 'yc', 'yr'], // 分别对应三条横线和三条竖线
      diff: 3, // 相距 dff 像素将自动吸附
      lineStatus: {
        xt: false,
        xc: false,
        xb: false,
        yl: false,
        yc: false,
        yr: false,
      },
      itemRefs: {},
      curComponent: computed(()=>store.state.curComponent),
      componentData: computed(()=>store.state.componentData),
    })
    onMounted(()=>{
      // 监听元素移动和不移动的事件
      eventBus.on('move', (isDownward: any, isRightward: any) => {
        showLine(isDownward, isRightward)
      })

      eventBus.on('unmove', () => {
        hideLine()
      })
    })
    return {
      ...toRefs(state),
      setItemRef,
      hideLine,
      showLine,
      isNearly,
      translatecurComponentShift,
      chooseTheTureLine,
    }
    function setItemRef(el: any, index:number) {
      console.log('typeof el :>> ', typeof el)
      state.itemRefs[state.lines[index]]  = el
    }
    function hideLine() {
      Object.keys(state.lineStatus).forEach(line => {
        state.lineStatus[line] = false
      })
    }

    function  isNearly(dragValue: number, targetValue: number) {
      return Math.abs(dragValue - targetValue) <= state.diff
    }

    function showLine(isDownward: any, isRightward: any) {
      const components = state.componentData
      const curComponentStyle = getComponentRotatedStyle(state.curComponent.style)
      const curComponentHalfwidth = curComponentStyle.width / 2
      const curComponentHalfHeight = curComponentStyle.height / 2

      hideLine()
      components.forEach((component:object = {
        style: {}
      }) => {
        if (component == state.curComponent) return
        const componentStyle = getComponentRotatedStyle((<any>component).style)
        const { top, left, bottom, right } = componentStyle
        const componentHalfwidth = componentStyle.width / 2
        const componentHalfHeight = componentStyle.height / 2
        const conditions = {
          top: [
            {
              isNearly: isNearly(curComponentStyle.top, top),
              lineNode: state.itemRefs.xt, // xt
              line: 'xt',
              dragShift: top,
              lineShift: top,
            },
            {
              isNearly: isNearly(curComponentStyle.bottom, top),
              lineNode: state.itemRefs.xt, // xt
              line: 'xt',
              dragShift: top - curComponentStyle.height,
              lineShift: top,
            },
            {
              // 组件与拖拽节点的中间是否对齐
              isNearly: isNearly(curComponentStyle.top + curComponentHalfHeight, top + componentHalfHeight),
              lineNode: state.itemRefs.xc, // xc
              line: 'xc',
              dragShift: top + componentHalfHeight - curComponentHalfHeight,
              lineShift: top + componentHalfHeight,
            },
            {
              isNearly: isNearly(curComponentStyle.top, bottom),
              lineNode: state.itemRefs.xb, // xb
              line: 'xb',
              dragShift: bottom,
              lineShift: bottom,
            },
            {
              isNearly: isNearly(curComponentStyle.bottom, bottom),
              lineNode: state.itemRefs.xb, // xb
              line: 'xb',
              dragShift: bottom - curComponentStyle.height,
              lineShift: bottom,
            },
          ],
          left: [
            {
              isNearly: isNearly(curComponentStyle.left, left),
              lineNode: state.itemRefs.yl, // yl
              line: 'yl',
              dragShift: left,
              lineShift: left,
            },
            {
              isNearly: isNearly(curComponentStyle.right, left),
              lineNode: state.itemRefs.yl, // yl
              line: 'yl',
              dragShift: left - curComponentStyle.width,
              lineShift: left,
            },
            {
              // 组件与拖拽节点的中间是否对齐
              isNearly: isNearly(curComponentStyle.left + curComponentHalfwidth, left + componentHalfwidth),
              lineNode: state.itemRefs.yc, // yc
              line: 'yc',
              dragShift: left + componentHalfwidth - curComponentHalfwidth,
              lineShift: left + componentHalfwidth,
            },
            {
              isNearly: isNearly(curComponentStyle.left, right),
              lineNode: state.itemRefs.yr, // yr
              line: 'yr',
              dragShift: right,
              lineShift: right,
            },
            {
              isNearly: isNearly(curComponentStyle.right, right),
              lineNode: state.itemRefs.yr, // yr
              line: 'yr',
              dragShift: right - curComponentStyle.width,
              lineShift: right,
            },
          ],
        }
                
        const needToShow: any[] = []
        const { rotate } = state.curComponent.style
        Object.keys(conditions).forEach(key => {
          // 遍历符合的条件并处理
          conditions[key].forEach((condition: { isNearly: any; dragShift: any; lineNode: { style: { [x: string]: string } }; lineShift: any; line: any }) => {
            if (!condition.isNearly) return
            // 修改当前组件位移
            store.commit('setShapeSingleStyle', { 
              key,
              value: rotate != 0? translatecurComponentShift(key, condition, curComponentStyle) : condition.dragShift,
            })

            condition.lineNode.style[key] = `${condition.lineShift}px`
            needToShow.push(condition.line)
          })
        })

        // 同一方向上同时显示三条线可能不太美观，因此才有了这个解决方案
        // 同一方向上的线只显示一条，例如多条横条只显示一条横线
        if (needToShow.length) { 
          chooseTheTureLine(needToShow, isDownward, isRightward)
        }
      })
    }
    function translatecurComponentShift(key: string, condition: { dragShift: number }, curComponentStyle: { height: number; width: number }) {
      const { width, height } = state.curComponent.style
      if (key == 'top') {
        return Math.round(condition.dragShift - (height - curComponentStyle.height) / 2)
      }

      return Math.round(condition.dragShift - (width - curComponentStyle.width) / 2)
    }

    function chooseTheTureLine(needToShow: string|string[], isDownward: any, isRightward: any) {
      // 如果鼠标向右移动 则按从右到左的顺序显示竖线 否则按相反顺序显示
      // 如果鼠标向下移动 则按从下到上的顺序显示横线 否则按相反顺序显示
      if (isRightward) {
        if (needToShow.includes('yr')) {
          state.lineStatus.yr = true
        } else if (needToShow.includes('yc')) {
          state.lineStatus.yc = true
        } else if (needToShow.includes('yl')) {
          state.lineStatus.yl = true
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (needToShow.includes('yl')) {
          state.lineStatus.yl = true
        } else if (needToShow.includes('yc')) {
          state.lineStatus.yc = true
        } else if (needToShow.includes('yr')) {
          state.lineStatus.yr = true
        }
      }

      if (isDownward) {
        if (needToShow.includes('xb')) {
          state.lineStatus.xb = true
        } else if (needToShow.includes('xc')) {
          state.lineStatus.xc = true
        } else if (needToShow.includes('xt')) {
          state.lineStatus.xt = true
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (needToShow.includes('xt')) {
          state.lineStatus.xt = true
        } else if (needToShow.includes('xc')) {
          state.lineStatus.xc = true
        } else if (needToShow.includes('xb')) {
          state.lineStatus.xb = true
        }
      }
    }
  },
  methods: {
    

    

    

    
  },
})
</script>

<style lang="scss" scoped>
.mark-line {
    height: 100%;
}
.line {
    background: #59c7f9;
    position: absolute;
    z-index: 1000;
}
.xline {
    width: 100%;
    height: 1px;
}
.yline {
    width: 1px;
    height: 100%;
}
</style>