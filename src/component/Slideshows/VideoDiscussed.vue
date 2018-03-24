<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slide nm-block title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slide nm-block discussed">
                <div class="p-2" :id="'tooltip' + $vnode.tag" style="opacity:0; position: absolute;"
                    :style="{
                        left: `${current_point && current_point.x}px`, 
                        top: `${current_point && (current_point.y - 5)}px` 
                    }">
                </div>
                <b-tooltip :show="show_tooltip" :target="'tooltip' + $vnode.tag">
                    {{ tooltip_message }}
                </b-tooltip>
                <template v-for="(assignment, i) in videos">
                    <div class="content-block nm-block">
                        <styled-text style="padding-left: 2vw; width: 23vw;" :context="context">
                            {{ assignment.name }}
                        </styled-text>
                        <styled-text :style="{ color : context.color_schema[i] }"
                            style="width: 18vw; font-weight: 500;" :context="context">
                            discussed {{ assignment.val }} times
                        </styled-text>
                        <ul style="width: 20vw; margin-top: 1vh;">
                            <li :style="{ background : context.color_schema[i] }"
                                :class="{ active: post == current_post }"
                                class="circle" v-for="post in assignment.posts"
                                @click ="click(post)"
                            ></li>
                        </ul>
                    </div>
                </template>
                <div class="content-block">
                    <b-card v-if="current_post" :sub-title="current_post.title">
                        <p class="card-text">
                            {{ current_post.username }} : {{ current_post.body }}
                        </p>
                    </b-card>
                </div>
            </div>
            <follow-up :item="item" :context="context"></follow-up>
        </template>
    </div>
</template>

<script>
    import Plottable from "plottable";
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
            };
        },
        watch: {
            current_post(val) {
                this.item.cache.current_post = val;
            }
        },
        extends: SlideshowBase,
        mounted() {
            this.current_post = this.item.cache.current_post;
            // var element = this.$el.getElementsByClassName('graph')[0];
            // this.table.renderTo(element);
        },
        computed: {
            videos() {
                return this.item.data.videos.filter(d => d.val);
            },
            empty_videos() {
                return this.item.data.videos.filter(d => !d.val);
            }
        },
        methods: {
            click(post) {
                this.current_post = this.current_post == post ? null : post;
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
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(255,255,255,0.0);
    float: left;
    margin-right: 5px;
    margin-bottom: 5px;
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