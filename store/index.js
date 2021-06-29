// 在服务端渲染期间运行的是同一个实例
// 为了防止数据冲突，务必把 state 定义成一个函数，返回数据对象
// export const state = () => {
//     return {
//         foo: "bar"
//     }
// }

const cookieParser = process.server ? require("cookieparser") : undefined

export const state = () => ({
    // 当前登录用户的登录状态
    user: null
})

export const mutations = {
    setUser (state, data) {
        state.user = data
    }
}

export const actions = {
    /**
     * nuxtServerInit 是一个特殊的 action 方法
     * 该方法会在服务端渲染期间自动调用
     * 作用：初始化容器数据，传递数据给客户端使用
    */
    nuxtServerInit ({ commit }, { req }) {
        let user = null

        // 如果请求头中有 Cookie
        if (req.headers.cookie) {
            // 使用 cookieParser 把 cookie 字符串转为 js 对象
            const parsed = cookieParser.parse(req.headers.cookie)

            try {
                user = JSON.parse(parsed.user)
            } catch (err) { }

            commit("setUser", user)
        }
    }
}
