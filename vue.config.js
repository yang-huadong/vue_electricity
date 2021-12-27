const path = require('path'); // 引入path模块
function resolve(dir) {
    return path.join(__dirname, dir) //path.join(_dirname)设置绝对路径
}
let proxyObj = {} // 代理对象

proxyObj['/'] = {
    // websocket
    ws: false,
    // 代理目标地址
    target: 'http://192.168.1.253:8081',
    // 发送请求头 host 会被设置 target
    changeOrigin: true,
    // 不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}

module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias
            //第一个参数：别名 第二个参数：路径
            .set('components', resolve('src/components'))
            .set('assets', resolve('src/assets'))
            .set('common', resolve('src/common'))
            .set('views', resolve('src/views'))
    },
    devServer: {
        // open: true, // 配置自动启动浏览器
        port: 8081, //  不为8080
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '/api': {
                target: 'http://192.168.1.253:8081',
                // ws: true,
                // secure: false,
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '^/api': ''
                }
            }
        } // 配置多个代理
    },
    lintOnSave: false
};