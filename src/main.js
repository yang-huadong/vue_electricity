import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './plugins/element.js'
Vue.config.productionTip = false

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
Vue.prototype.$http = axios;

axios.interceptors.request.use(config => {
    // console.log(config);
    // 在headers请求头中的Authorization字段中添加token令牌
    config.headers.Authorization = sessionStorage.getItem('token')
    return config;
})

axios.interceptors.response.use(res => {
    // console.log(res);
    return res.data;
})
new Vue({
    render: h => h(App),
    router
}).$mount('#app')