<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content discussed">
                <div class="content-block">
                    <h5> 
                        Popular topics:
                    </h5>
                </div>
                <template v-for="(thread, i) in threads">
                    <div class="content-block" style="padding-left: 3vw;">
                        <h6 style="width: 25vw;">
                            <styled-text :context="context">
                                {{ thread.title }}
                            </styled-text>
                        </h6>
                        <h5 :style="{ color : context.color_schema[i] }"
                            style="width: 15vw;">
                            discussed {{ thread.comment_count }} times
                        </h5>
                        <ul style="width: 30vw; padding-top: 0.5vh;">
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
            <div class="slideshow-content keyword">
                <div class="content-block">
                    <h5> 
                        Popular keywords:
                    </h5>
                </div>
                <wordcloud
                    style="padding-left: 3vw; padding-right: 3vw;"
                    :data="keywords"
                    color="Category20c"
                    nameKey="word"
                    valueKey="val">
                </wordcloud>
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
                show_tooltip: false,
                tooltip_message: 'Hello World',
                current_point: {},
                current_comment: null,
                lastElement: null,
            };
        },
        components: {
            wordcloud,
        },
        created() {
            this.context.bus.$on("add-text-box", this.handle);
        },
        destroyed() {
            this.context.bus.$off("add-text-box", this.handle);
        },
        mounted() {
            // var element = this.$el.getElementsByClassName('graph')[0];
            // this.table.renderTo(element);
        },
        computed: {
            keywords() {
                return this.item.data.keywords;
            },
            threads() {
                return this.item.data.threads.slice(0, 5);
            },
        },
        methods: {
            handle(_id) {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            },
            click(comment) {
                this.current_comment = this.current_comment == comment ? null : comment;
            }
        },
        props: ["item", "context", "step"],
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

.slideshow-content.discussed {
    padding-top: 2vh;
    padding-bottom: 1vh;
    height: 100%;
    flex-direction: column;
    display: flex;
}

.slideshow-content.keyword {
    padding-top: 1vh;
    padding-bottom: 1vh;
    height: 30vh;
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