<template>
    <div class="editor-page">
        <div class="container page">
            <div class="row">
                <div class="col-md-10 offset-md-1 col-xs-12">
                    <form @submit.prevent="onSubmit">
                        <fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control form-control-lg" placeholder="Article Title"
                                    v-model="article.title">
                            </fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control" placeholder="What's this article about?"
                                    v-model="article.description">
                            </fieldset>
                            <fieldset class="form-group">
                                <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)"
                                    v-model="article.body"></textarea>
                            </fieldset>
                            <fieldset class="form-group">
                                <input type="text" class="form-control" placeholder="Enter tags" v-model="article.tags">
                                <div class="tag-list"></div>
                            </fieldset>
                        </fieldset>
                        <button class="btn btn-lg pull-xs-right btn-primary">
                            Publish Article
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createArticle, getArticle, updateArticle } from "@/api/article"
export default {
    // 在路由匹配组件渲染之前会先执行中间件处理
    middleware: 'auth',
    name: "EditorIndex",
    data () {
        return {
            article: {
                title: "",
                description: "",
                body: "",
                tags: ""
            }
        }
    },
    async mounted () {
        if (this.$route.query.slug) {
            const { data } = await getArticle(this.$route.query.slug)
            const { article } = data
            this.article = Object.assign(this.article, article)
            this.article.tags = article.tagList.join(",")
            console.log(this.article)
        }
    },
    methods: {
        async onSubmit () {
            // 字符串转数组
            const tagList = this.article.tags.replaceAll(/\W/g, ",").split(",")

            const article = {
                title: this.article.title,
                description: this.article.description,
                body: this.article.body,
                tagList
            }

            if (this.$route.query.slug) {
                await updateArticle(this.article.slug, { article })
                this.$router.push({ name: "article", params: { slug: this.article.slug } })
                return
            }
            await createArticle({ article })
            this.$router.push("/")
        }
    }
}
</script>

<style lang='' scoped>
</style>
