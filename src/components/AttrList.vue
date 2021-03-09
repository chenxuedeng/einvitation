<template>
  <div class="attr-list">
    <el-form>
      <el-form-item
        v-for="(key, index) in styleKeys.filter(item => item != 'rotate')"
        :key="index"
        :label="map[key]">
        <el-color-picker v-if="key == 'borderColor'" v-model="curComponent.style[key]"/>
        <el-color-picker v-else-if="key == 'color'" v-model="curComponent.style[key]"/>
        <el-color-picker v-else-if="key == 'backgroundColor'" v-model="curComponent.style[key]"/>
        <el-select v-else-if="key == 'textAlign'" v-model="curComponent.style[key]">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-else-if="key === 'animationDuration'"
          v-model="curComponent.style[key]"
          type="text" />
        <el-input
          v-else-if="key === 'animationDelay'"
          v-model="curComponent.style[key]"
          type="text" />
        <el-input
          v-else
          v-model="curComponent.style[key]"
          type="number" />
      </el-form-item>
      <el-form-item v-if="curComponent && !excludes.includes(curComponent.component)" label="内容">
        <el-input v-model="curComponent.propValue" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, toRefs } from "vue"
import { useStore } from "vuex"

export default defineComponent({
  setup(){
    onMounted(()=>{
      console.log(state.styleKeys)
    })
    const store = useStore()
    const state = reactive({
      excludes: ['Picture', 'Group'], // 这些组件不显示内容
      options: [
        {
          label: '左对齐',
          value: 'left',
        },
        {
          label: '居中',
          value: 'center',
        },
        {
          label: '右对齐',
          value: 'right',
        },
      ],
      map: {
        left: 'x 坐标',
        top: 'y 坐标',
        height: '高',
        width: '宽',
        color: '颜色',
        backgroundColor: '背景色',
        borderWidth: '边框宽度',
        borderColor: '边框颜色',
        borderRadius: '边框半径',
        fontSize: '字体大小',
        fontWeight: '字体粗细',
        lineHeight: '行高',
        letterSpacing: '字间距',
        textAlign: '对齐方式',
        opacity: '透明度',
        animationDuration: '动画时间长',
        animationDelay: '动画延时执行',
      },
      styleKeys: computed(()=> store.state.curComponent? Object.keys(store.state.curComponent.style) : []),
      curComponent: computed(()=> store.state.curComponent),
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.attr-list {
    overflow: auto;
    padding: 20px;
    padding-top: 0;
    height: 100%;
}
</style>