import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createRouterScroller } from 'vue-router-better-scroller'
import router from './router'
import App from './App.vue'
import 'normalize.css'
import '@/styles/index.less'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(router)
app.use(pinia)

// 增强了 Vue Router v4 的滚动行为
app.use(createRouterScroller({
  selectors: {
    'window': true,
    'body': true,
    '.scrollable': true,
  },
}))

app.mount('#app')
