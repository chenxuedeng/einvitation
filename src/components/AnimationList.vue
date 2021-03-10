<template>
  <div class="animation-list">
    <div class="div-animation">
      <el-button @click="isShowAnimation = true">添加动画</el-button>
      <el-button @click="previewAnimate">预览动画</el-button>
      <div
        v-for="(tag, index) in curComponent.animations"
        :key="index">
        <el-tag          
          closable
          @close="removeAnimation(Number(index))"
        />
         <!-- 设置动画延时和时长 -->
         <div class="animation-config">
            <el-form
              style="width: 100%;text-align: left;"
              label-width="80px"
              label-position="top"
              class="animation-config-form"
              >
              <el-form-item label="时间">
                {{tag}}
                <el-slider
                  v-model="tag.animationDuration"
                  :min="1"
                  :max="10"
                  :step="0.1"
                  input-size="mini"
                  show-input
                />
              </el-form-item>
              <el-form-item label="延时">
                <el-slider
                  v-model="tag.animationDelay"
                  :min="0"
                  :max="10"
                  :step="0.1"
                  input-size="mini"
                  show-input
                />
              </el-form-item>
              <el-form-item label="循环次数">
                <el-select v-model="tag.count">
                  <el-option
                  v-for="(item,index) in countList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
      </div>
    </div>

    <!-- 选择动画 -->
    <Modal v-model:show="isShowAnimation">
      <el-tabs v-model="animationActiveName">
        <el-tab-pane
          v-for="item in animationClassData"
          :key="item.label"
          :label="item.label"
          :name="item.label">
          <el-scrollbar class="animate-container">
            <div
              v-for="(animate, index) in item.children"
              :key="index"
              class="animate"
              @mouseover="hoverPreviewAnimate = animate.value"
              @click="addAnimation(animate)"
            >
              <div :class="[hoverPreviewAnimate === animate.value && animate.value + ' animated']">
                {{ animate.label }}
              </div>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </Modal>
  </div>
</template>

<script lang="ts">
import Modal from '/@/components/Modal.vue'
import eventBus from '/@/utils/eventBus'
import animationClassData from '/@/utils/animationClassData'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useStore } from "vuex"

export default defineComponent({
  components: { Modal },
  setup(){
    const store = useStore()
    const state = reactive({
      isShowAnimation: false,
      hoverPreviewAnimate: '',
      animationActiveName: '进入',
      animationClassData,
      showAnimatePanel: false,
      curComponent: computed(()=>store.state.curComponent),
      countList: [
        {
          label: '1次',
          value: 1,
        },
        {
          label: '无限次',
          value: -1,
        },
      ],
    })

    function addAnimation(animate:object) {
      const animateConfig = {
        ...animate,
        animationDuration: 1,
        animationDelay: 0,
        count: 1,
      }
      store.commit('addAnimation', animateConfig)
      state.isShowAnimation = false
    }

    function previewAnimate() {
      eventBus.emit('runAnimation')
    }

    function removeAnimation(index:number) {
      store.commit('removeAnimation', index)
    }

    return {
      ...toRefs(state),
      addAnimation,
      previewAnimate,
      removeAnimation,
    }
  },
})
</script>

<style lang="scss">
.animation-list {
  padding: 15px 0 0 0;
    .div-animation {
        text-align: center;

        & > div {
            margin-top: 20px;
        }

        .el-tag {
            display: block;
            width: 50%;
            margin: auto;
            margin-bottom: 10px;
        }
    }
    .animation-config{
      padding: 0 10px;
      &-form{
        padding: 0 15px;
      }
    }
    .el-scrollbar__view {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding-left: 10px;

        .animate > div {
            width: 100px;
            height: 60px;
            background: #f5f8fb;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 12px;
            margin-bottom: 10px;
            font-size: 12px;
            color: #333;
            border-radius: 3px;
            user-select: none;
            cursor: pointer;
        }
    }
}
</style>
<style lang="scss" scoped>
  ::v-deep(.el-form-item__label){
    color: #bec0cc !important;
  }
</style>