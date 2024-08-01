import { createApp } from 'vue'
// import './style.css'
import './style/reset.css'
import './style/common.scss'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementUI, { size: 'default' })
app.use(router)
app.mount('#app')
