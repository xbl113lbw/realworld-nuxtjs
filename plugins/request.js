/**
 * 基于 axios 封装的请求模块
*/

import axios from "axios"

export const request = axios.create({
    baseURL: "https://conduit.productionready.io"
})

// 通过插件获取上下文对象 context
// 插件导出函数必须作为默认成员（default）
export default ({ store }) => {
    /**
     * 请求拦截器
     * 任何请求都要经过请求拦截器
     * 可以在请求拦截器中做一些公共的业务处理
    */
    request.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        const { user } = store.state

        if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
        }

        // 返回 config 配置
        return config
    }, function (error) {
        // 对请求错误做些什么（此时请求还没有发出去）
        return Promise.reject(error)
    })

    // 相应拦截器
}
