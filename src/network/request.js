import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        baseURL: "http://127.0.0.1:8888/api/private/v1/",
        timeout: 5000,
    })

    // 请求拦截
    instance.interceptors.request.use(config => {
        console.log(config);
        return config;
    }, err => {
        console.log(err);
        console.log('请求失败');
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
        console.log(res);
        return res.data;
    }, err => {
        console.log(err);
        console.log('响应失败');
    })

    return instance(config);
}