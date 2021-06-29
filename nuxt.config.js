export default {
    router: {
        linkActiveClass: 'active',
        // 自定义路由表
        extendRoutes (routes, resolve) {
            //todo 清除 nuxt 基于 pages 目录默认生成的路由表规则
            routes.splice(0)

            routes.push(...[
                {
                    path: "/",
                    component: resolve(__dirname, "pages/layout/"),
                    children: [
                        {
                            // 默认子路由
                            path: "",
                            name: "home",
                            component: resolve(__dirname, "pages/home/")
                        }, {
                            path: "/login",
                            name: "login",
                            component: resolve(__dirname, "pages/login/")
                        }, {
                            path: "/register",
                            name: "register",
                            component: resolve(__dirname, "pages/login/")
                        }, {
                            path: "/profile/:username",
                            name: "profile",
                            component: resolve(__dirname, "pages/profile/")
                        }, {
                            path: "/settings",
                            name: "settings",
                            component: resolve(__dirname, "pages/settings/")
                        }, {
                            path: "/editor",
                            name: "editor",
                            component: resolve(__dirname, "pages/editor/")
                        }, {
                            path: "/article/:slug",
                            name: "article",
                            component: resolve(__dirname, "pages/article/")
                        }
                    ]
                },
            ])
        }
    },
    plugins: [
        '~/plugins/request.js',
        '~/plugins/dayjs.js',
    ],
    server: {
        // host: "0.0.0.0",
        port: 3000
    }
}