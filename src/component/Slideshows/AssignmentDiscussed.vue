<template>
<div>
    <div class="b4w bh nm-block discussed">
        <template v-for="(assignment, i) in assignments">
            <div class="content-block nm-block">
                <styled-text style="padding-left: 2vw; width: 25vw;" :context="context">
                    {{ assignment.name }}
                </styled-text>
                <styled-text style="width: 15vw; font-weight: 500;" :context="context"
                :style="{ color : context.color_schema[i] }">
                    discussed {{ assignment.val }} times
                </styled-text>
                <ul style="width: 20vw; padding-top: 1vh;">
                    <li :style="{ background : context.color_schema[i] }"
                        :class="{ active: post == current_post }"
                        class="circle" v-for="post in assignment.posts"
                        @click ="click(post)"
                    ></li>
                </ul>
            </div>
        </template>
        <div class="content-block nm-block">
            <b-card v-if="current_post" :sub-title="current_post.title">
                <p class="card-text">
                    {{ current_post.username }} : {{ current_post.body }}
                </p>
            </b-card>
        </div>
    </div>
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
            assignments() {
                return this.item.data.assignments;
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