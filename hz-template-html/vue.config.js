// vue.config.js文件
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 配置相对路径
    devServer: {
        host: "0.0.0.0",//0.0.0.0//代表当前域名和ipv4域名下都行
        port: 8081,
        // 跨域
        proxy: {
            '/': {
                target: "http://127.0.0.1:9999", //要跨域的地址，接口对接使用  //末尾不要加斜杠
                changeOrigin: true, // 允许跨域
                ws: false,
                pathRewrite: {
                    '^/': '/'
                }
            }
        }
    }
})