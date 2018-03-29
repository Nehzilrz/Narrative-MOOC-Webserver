<template>
<div>
    <div class="b4w bh nm-block learner-profile">
        <styled-text :context="context">
            No enough practice:
        </styled-text>
        <b-progress class="mt-1" height="2.5rem" :max="nopractice.n">
            <b-progress-bar v-for="item, i in nopractice.list"
                @mouseover.native="mouseover"
                @click.native="mouseover"
                :style="{'background-color': color_schema[i % color_schema.length]}"
                :value="item.val"
                :label="item.name"
                :title="`${item.val} ${item.name} learners, ${Number(item.val/nopractice.n*100).toFixed(2)}%`">
            </b-progress-bar>
        </b-progress>
    </div>
    <div class="b4w bh nm-block learner-profile">
        <styled-text :context="context">
            Having difficulties:
        </styled-text>
        <b-progress class="mt-1" height="2.5rem" :max="difficulties.n">
            <b-progress-bar v-for="item, i in difficulties.list"
                @mouseover.native="mouseover"
                @click.native="mouseover"
                :style="{'background-color': color_schema[i % color_schema.length]}"
                :value="item.val"
                :label="item.name"
                :title="`${item.val} ${item.name} learners, ${Number(item.val/difficulties.n*100).toFixed(2)}%`">
            </b-progress-bar>
        </b-progress>
    </div>
</div>
</template>

<script>
    import { color_schema } from "../../lib/colors";
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
                color_schema,
            };
        },
        extends: SlideshowBase,
        methods: {
            mouseover(e) {
                const title = e.target.attributes.title;
                if (!title) return;
                const message = e.target.attributes.title.nodeValue;
                const element = this.$el.getBoundingClientRect();
                const position = {
                    x: e.clientX - element.left - 50,
                    y: e.clientY - element.top,
                };
                const event = {
                    message,
                    position,
                    time: new Date(),
                };
                this.$emit('showtooltip', event);
            },
        },
        computed: {
            info() {
                return this.data.difficulties.sort((a, b) => a.time - b.time);
            },
            nopractice() {
                const users = this.info.slice(0, this.info.length * 0.2);
                const count = {};
                for (const user of users) {
                    let val;
                    val = user.grade || 0;
                    if (!count[val]) count[val] = 0;
                    count[val] += 1;
                }
                const list = Object.keys(count).map(d => ({ name: d, val: count[d] }));
                return {
                    list,
                    n: list.map(d => d.val).reduce((a, b) => a + b),
                };
            },
            difficulties() {
                const users = this.info.slice(this.info.length * 0.8);
                const count = {};
                for (const user of users) {
                    let val;
                    val = user.grade || 0;
                    if (!count[val]) count[val] = 0;
                    count[val] += 1;
                }
                const list = Object.keys(count).map(d => ({ name: d, val: count[d] }));
                return {
                    list,
                    n: list.map(d => d.val).reduce((a, b) => a + b),
                };
            },
        },
    };
</script>

<style scope>
.slide.text h6 {
    font-weight: 600;
}

.content-block div.circle {
    list-style: none;
    float: left;
    position: relative;
    cursor: pointer;
}

.content-block svg {
    width: 20px;
    height: 20px;
}

.content-block {
    display: inline-flex;
    flex-direction: row;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}
.content-block.detail {
    padding-left: 5vw;
}

.slide.learner-profile {
    padding-top: 2vh;
    padding-bottom: 1vh;
    padding-left: 2vh;
    flex-direction: column;
    display: flex;
    position: relative;
}

</style>