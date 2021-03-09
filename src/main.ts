import { createApp, defineAsyncComponent } from 'vue'
import router from './router/index'
import App from './App.vue'
import store from './store/index'
import ElementPlus from 'element-plus'
import componentList from '/@/custom-component/component-list'

import '/@/assets/iconfont/iconfont.css'
import '/@/styles/animate.css'
import 'element-plus/lib/theme-chalk/index.css'
import '/@/styles/reset.css'

const app = createApp(App)
componentList.forEach((component) => {
  app.component(component.name, defineAsyncComponent(() => import(/* @vite-ignore */`/@/custom-component/${component.name}/${component.version}.vue`)))
})

app
.use(router)
.use(store)
.use(ElementPlus,{size: 'small'})
.mount('#app')


