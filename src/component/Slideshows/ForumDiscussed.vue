<template>
<div>
    <div class="b4w bh nm-block discussed">
        <div class="content-block">
            <h5> 
                Popular topics:
            </h5>
        </div>
        <template v-for="(thread, i) in threads">
            <div class="content-block nm-block">
                <styled-text style="width: 25vw;" :context="context">
                    {{ thread.title }}
                </styled-text>
                <h5 :style="{ color : context.color_schema[i] }"
                    style="width: 15vw;
                    padding-top: .5em;">
                    discussed {{ thread.comment_count }} times
                </h5>
                <ul style="width: 30vw; padding-top: 1em;">
                    <li :style="{
                        background : context.color_schema[i],
                        width: thread.comment_count < 50 ? '15px' : '12px',
                        height: thread.comment_count < 50 ? '15px' : '12px',
                        'margin-right': thread.comment_count < 50 ? '5px' : '3px',
                        'margin-bottom': thread.comment_count < 50 ? '5px' : '3px',
                    }"
                        :class="{ active: comment == current_comment }"
                        class="circle" v-for="comment in thread.comments"
                        @click="click(comment)"
                    ></li>
                </ul>
            </div>
        </template>
        <div class="content-block">
            <b-card v-if="current_comment" :sub-title="current_comment.title">
                <p class="card-text">
                    {{ current_comment.username }} : {{ current_comment.body }}
                </p>
            </b-card>
        </div>
    </div>
    <div class="b4w bh nm-block keyword">
        <div class="content-block nm-block">
            <h5> 
                Popular keywords:
            </h5>
        </div>
        <wordcloud
            class="nm-block"
            style="padding-left: 3vw; padding-right: 3vw;"
            :data="keywords"
            color="Category20c"
            nameKey="word"
            valueKey="val">
        </wordcloud>
    </div>
</div>
</template>

<script>
    import wordcloud from 'vue-wordcloud';
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
                current_comment: null,
                keywords: [],
            };
        },
        extends: SlideshowBase,
        components: {
            wordcloud,
        },
        mounted() {
            setTimeout(() => { this.keywords = this.data.keywords; }, 50);
            // var element = this.$el.getElementsByClassName('graph')[0];
            // this.table.renderTo(element);
        },
        computed: {
            threads() {
                return this.data.threads.slice(0, 5);
            },
        },
        methods: {
            click(comment) {
                this.current_comment = this.current_comment == comment ? null : comment;
            }
        },
    };
</script>

<style scope>
.slide.text h6 {
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

.slide.discussed {
    padding-top: 2vh;
    padding-bottom: 1vh;
    height: 100%;
    flex-direction: column;
    display: flex;
}

.slide.keyword {
    padding-top: 1vh;
    padding-bottom: 1vh;
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