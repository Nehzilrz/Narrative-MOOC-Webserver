<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content discussed">
                <template v-for="(assignment, i) in assignments">
                    <div class="content-block">
                        <h6 style="padding-left: 2vw; width: 25vw;">
                            <styled-text :context="context">
                                {{ assignment.name }}
                            </styled-text>
                        </h6>
                        <h5 :style="{ color : context.color_schema[i] }"
                            style="width: 15vw;">
                            discussed {{ assignment.val }} times
                        </h5>
                        <ul style="width: 20vw; padding-top: 0.5vh;">
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

    export default {
        data() {
            return {
                current_post: null,
            };
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
            assignments() {
                return this.item.data.assignments;
            }
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
            click(post) {
                this.current_post = this.current_post == post ? null : post;
            }
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

.slideshow-content.discussed {
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