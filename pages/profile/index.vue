<template>
    <div class="profile-page">

        <div class="user-info">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-md-10 offset-md-1">
                        <img :src="profile.image" class="user-img" />
                        <h4>{{profile.username}}</h4>
                        <p>{{profile.bio}}</p>
                        <!-- 跳转设置 -->
                        <button class="btn btn-sm btn-outline-secondary action-btn" @click="toSetting"
                            v-if="profile.username === $store.state.user.username">
                            <i class="ion-gear-a"></i>
                            &nbsp;
                            Edit Profile Settings
                        </button>
                        <!-- 关注 -->
                        <button class="btn btn-sm btn-outline-secondary action-btn" @click="onFollow(profile)" v-else>
                            <i class="ion-plus-round"></i>
                            &nbsp;
                            {{profile.following ? `Unfollow ${profile.username}` : `Follow ${profile.username}`}}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                    <div class="articles-toggle">
                        <ul class="nav nav-pills outline-active">
                            <li class="nav-item">
                                <nuxt-link class="nav-link" :class="{active:tab === 'mine'}"
                                    :to="{name:'profile',params:{username:profile.username},query:{tab:'mine'}}" exact>
                                    My Articles
                                </nuxt-link>
                            </li>
                            <li class="nav-item">
                                <nuxt-link class="nav-link" :class="{active:tab === 'favorited'}"
                                    :to="{name:'profile',params:{username:profile.username},query:{tab:'favorited'}}"
                                    exact>
                                    Favorited Articles
                                </nuxt-link>
                            </li>
                        </ul>
                    </div>

                    <div class="article-preview" v-for="article in articles" :key="article.slug">
                        <div class="article-meta">
                            <nuxt-link :to="{name:'profile',params:{username:article.author.username}}">
                                <img :src="article.author.image" />
                            </nuxt-link>
                            <div class="info">
                                <nuxt-link class="author"
                                    :to="{name:'profile',params:{username:article.author.username}}">
                                    {{article.author.username}}
                                </nuxt-link>
                                <span class="date">{{article.createdAt | date("MMM DD,YYYY")}}</span>
                            </div>
                            <button class="btn btn-outline-primary btn-sm pull-xs-right"
                                :class="{active:article.favorited}" @click="onFavorite(article)"
                                :disabled="article.favoriteDisabled">
                                <i class="ion-heart"></i> {{article.favoritesCount}}
                            </button>
                        </div>
                        <nuxt-link :to="{name:'article',params:{slug:article.slug}}" class="preview-link">
                            <h1>{{article.title}}</h1>
                            <p>{{article.description}}</p>
                            <span>Read more...</span>
                        </nuxt-link>
                    </div>

                    <!-- 分页 -->
                    <nav>
                        <ul class="pagination">
                            <li class="page-item" :class="{active:item == page}" v-for="item in totalPage" :key="item">
                                <nuxt-link class="page-link ng-binding"
                                    :to="{name:'home',query:{page:item,tag:$route.query.tag,tab}}">
                                    {{item}}
                                </nuxt-link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProfile, Follow, Unfollow } from "@/api/profile"
import { getArticles, addFavorite, deleteFavorite } from "@/api/article"

export default {
    // 在路由匹配组件渲染之前会先执行中间件处理
    middleware: 'auth',
    name: "UserProfile",
    async asyncData ({ params, query }) {
        const { tab = "mine" } = query
        const limit = 20
        const page = Number.parseInt(query.page || 1)

        // 获取个人信息
        const { data: profileData } = await getProfile(params.username)
        console.log(profileData)

        const articleObj = tab === "mine" ?
            { author: params.username, limit, offset: (page - 1) * limit, } :
            { favorited: params.username, limit, offset: (page - 1) * limit, }

        const { data: articleData } = await getArticles(articleObj)
        // 为按钮添加状态
        articleData.articles.forEach(article => article.favoriteDisabled = false)

        return {
            profile: profileData.profile,
            articles: articleData.articles,
            articlesCount: articleData.articlesCount,
            tab,
            limit,
            page,
        }
    },
    watchQuery: ["tab"],
    computed: {
        // 分页总页数
        totalPage () {
            return Math.ceil(this.articlesCount / this.limit)
        }
    },
    methods: {
        async onFavorite (article) {
            article.favoriteDisabled = true
            if (article.favorited) {
                // 取消点赞
                await deleteFavorite(article.slug)
                article.favorited = false
                article.favoritesCount += -1
            } else {
                // 添加点赞
                await addFavorite(article.slug)
                article.favorited = true
                article.favoritesCount += 1
            }
            article.favoriteDisabled = false
        },
        async onFollow (profile) {
            console.log(profile)
            if (profile.following) {
                Unfollow(profile.username)
                profile.following = false
            } else {
                Follow(profile.username)
                profile.following = true
            }
        },
        toSetting () {
            this.$router.push("/settings")
        }
    }
}
</script>

<style lang='' scoped>
</style>
