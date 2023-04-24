import { createApp } from 'vue'
import App from './App.vue'

import modal from '@/utils/modal'
import { addThousand, parseTime, getImageUrl } from '@/utils'

const app = createApp(App)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as Icons from '@element-plus/icons-vue'
// 全局注册图标 牺牲一点性能
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}

// 全局方法挂载
// 模态框对象
app.config.globalProperties.$modal = modal
// 千分位
app.config.globalProperties.$addThousand = addThousand
// 时间格式化
app.config.globalProperties.$parseTime = parseTime
// 获取图片地址
app.config.globalProperties.$getImageUrl = getImageUrl

// 对vue进行类型补充说明，不然在vue页面使用的时候会报错
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $addThousand: Function
    $parseTime: Function
    $getImageUrl: Function
  }
}

app.use(ElementPlus)
app.mount('#app')