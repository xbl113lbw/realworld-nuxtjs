<template>
    <div class="settings-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-6 offset-md-3 col-xs-12">
                    <h1 class="text-xs-center">Your Settings</h1>
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input class="form-control" type="text" placeholder="URL of profile picture"
                                    v-model="userForm.image">
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Your Name"
                                    v-model="userForm.username">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea class="form-control form-control-lg" rows="8"
                                    placeholder="Short bio about you" v-model="userForm.bio"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="text" placeholder="Email"
                                    v-model="userForm.email">
                            </fieldset>
                            <fieldset class="form-group">
                                <input class="form-control form-control-lg" type="password" placeholder="Password"
                                    v-model="userForm.password">
                            </fieldset>
                            <button class="btn btn-lg btn-primary pull-xs-right">
                                Update Settings
                            </button>
                        </fieldset>
                    </form>
                </div>
            </div>
            <!-- 退出登录 -->
            <button class="btn btn-outline-danger" @click="logout">
                Or click here to logout.
            </button>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex"
import { updateUser } from "@/api/user"
// 只在客户端加载 js-cookie 包
const Cookie = process.client ? require("js-cookie") : undefined

export default {
    // 在路由匹配组件渲染之前会先执行中间件处理
    middleware: 'auth',
    name: "SettingsIndex",
    data () {
        return {
            userForm: {
                image: "",
                username: "",
                bio: "",
                email: "",
                password: "",
            }
        }
    },
    computed: {
        ...mapState(["user"])
    },
    mounted () {
        // 回显数据
        const { image, username, bio, email, password } = this.user
        this.userForm = { image, username, bio, email, password }
    },
    methods: {
        async onSubmit () {
            const { data } = await updateUser({ user: this.userForm })
            // 更新保存的数据
            this.$store.commit("setUser", data.user)
            Cookie.set("user", data.user)
        },
        logout () {
            Cookie.remove("user")
            this.$store.commit("setUser", null)
            this.$router.push("/")
        }
    }
}
</script>

<style lang='' scoped>
</style>
