<template>
    <div class="article-meta">
        <nuxt-link :to="{name:'/profile',params:{username:article.author.username}}">
            <img :src="article.author.image" />
        </nuxt-link>
        <div class="info">
            <nuxt-link class="author" :to="{name:'/profile',params:{username:article.author.username}}">
                {{article.author.username}}
            </nuxt-link>
            <span class="date">{{article.createdAt | date("MMM DD,YYYY")}}</span>
        </div>
        <!-- 跳转设置 -->
        <button class="btn btn-sm btn-outline-secondary action-btn" @click="toEdit(article.slug)"
            v-if="article.author.username === $store.state.user.username">
            <i class="ion-edit"></i>
            &nbsp;
            Edit Article
        </button>
        <button class="btn btn-sm btn-outline-secondary" :class="{active:article.author.following}"
            @click="onFollow(article.author)" v-else>
            <i class="ion-plus-round"></i>
            &nbsp;
            {{article.author.following ? `Unfollow ${article.author.username}` : `Follow ${article.author.username}`}}
        </button>
        &nbsp;&nbsp;
        <button class="btn btn-sm btn-outline-primary" :class="{active:article.favorited}">
            <i class="ion-heart"></i>
            &nbsp;
            Favorite Post <span class="counter">{{(article.favoritesCount)}}</span>
        </button>
    </div>
</template>

<script>
import { Follow, Unfollow } from "@/api/profile"

export default {
    name: "ArticleMeta",
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    methods: {
        async onFollow (profile) {
            if (profile.following) {
                Unfollow(profile.username)
                profile.following = false
            } else {
                Follow(profile.username)
                profile.following = true
            }
        },
        toEdit (slug) {
            this.$router.push({ name: "editor", query: { slug } })
        }
    }
}
</script>

<style lang='' scoped>
</style>
