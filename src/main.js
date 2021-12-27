import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 1. 画图表先导入echarts
import * as echarts from 'echarts'
import './plugins/element.js'
// 导入富文本编辑器 和 对应的样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


// 导入网页进度条包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.config.productionTip = false



axios.defaults.baseURL = "/api"
Vue.prototype.$http = axios;


import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)


axios.interceptors.request.use(config => {
    NProgress.start();
    // console.log(config);
    // 在headers请求头中的Authorization字段中添加token令牌
    config.headers.Authorization = sessionStorage.getItem('token')
    return config;
})

/** 在 response 拦截器中，隐藏进度条 NProgress.done()*/
axios.interceptors.response.use(res => {
    NProgress.done();
    // console.log(res);
    return res.data;
})

// 全局过滤器
// 时间过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    console.log(dt);
    const y = dt.getFullYear()
        // 不足两位补齐两位
        // padStart(总长度,'不足总长度用字符串填充')
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 全局富文本
Vue.use(VueQuillEditor);
Vue.prototype.$echarts = echarts;
new Vue({
    render: h => h(App),
    router
}).$mount('#app')