import { createApp } from 'vue'
// import './style.css'
import './style/reset.css'
import './style/common.scss'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import pinia from './store'

const app = createApp(App)
app.use(ElementUI, { size: 'default' }).use(router).use(pinia).mount('#app')
