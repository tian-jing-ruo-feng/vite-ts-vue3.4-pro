import { createApp } from 'vue'
// import './style.css'
import ElementUI from 'element-plus'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './style/reset.css'
import './style/common.scss'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style/dark/css-vars.css'
import 'virtual:uno.css'

const app = createApp(App)
app.use(ElementUI, { size: 'default' }).use(router).use(pinia).mount('#app')
