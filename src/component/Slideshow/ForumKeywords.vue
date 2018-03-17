<template>
    <div class="slideshow-page">
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content keyword">
                <wordcloud
                    :data="keywords"
                    :color="Category20"
                    nameKey="word"
                    valueKey="val">
                </wordcloud>
            <!--
                <template v-for="(keyword, i) in keywords">
                    <div class="content-block">
                        <h6 style="padding-left: 2vw; width: 25vw;">
                            <styled-text :context="context">
                                {{ keyword.word }}
                            </styled-text>
                        </h6>
                    </div>
                </template>
                -->
                <!--
                <div class="content-block">
                    <b-card v-if="current_post" :sub-title="current_post.title">
                        <p class="card-text">
                            {{ current_post.body }}
                        </p>
                    </b-card>
                </div>
                !-->
            </div>
            <follow-up :item="item" :context="context"></follow-up>
        </template>
    </div>
</template>

<script>
    import wordcloud from 'vue-wordcloud';

    export default {
        data() {
            return {
                current_post: null,
            };
        },
        components: {
            wordcloud,
        },
        created() {
        },
        mounted() {
        },
        computed: {
            keywords() {
                return this.item.data.keywords;
            }
        },
        methods: {
        },
        props: ["item", "context"],
    };
</script>

<style scope>
.slideshow-content.text h6 {
    font-weight: 600;
}

.content-block li.circle {
    list-style: none;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(255,255,255,0.0);
    float: left;
    position: relative;
    cursor: pointer;
}

.content-block li.circle:hover {
    border-width: 2px;
    border-style: solid;
    border-color: #555555;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}

.content-block li.circle.active {
    border-width: 2px;
    border-style: solid;
    border-color: #555555;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}

.slideshow-content.keyword {
    padding-top: 2vh;
    padding-bottom: 2vh;
    height: 100%;
    flex-direction: column;
    display: flex;
}

.content-block {
    display: inline-flex;
    flex-direction: row;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}

</style>