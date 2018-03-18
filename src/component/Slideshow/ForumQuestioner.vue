<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content upvoted">
                <div class="content-block" style="padding-top: 2vh; padding-bottom: 2vh;">
                    <h5> 
                        Top 3 Questioners:
                    </h5>
                </div>
                <template v-for="(user, i) in questioners">
                    <div class="content-block" style="padding-left: 6vw;">
                        <h6 style="width: 15vw;">
                            <styled-text :context="context">
                                {{ user.username }}
                            </styled-text>
                        </h6>
                        <h5 :style="{ color : context.color_schema[i] }"
                            style="width: 15vw;">
                            posts {{ user.val }} topics
                        </h5>
                        <ul style="width: 30vw; padding-top: 0.5vh;">
                            <li :style="{
                                background : context.color_schema[i],
                                width: user.posts.length < 50 ? '15px' : '12px',
                                height: user.posts.length < 50 ? '15px' : '12px',
                                'margin-right': user.posts.length < 50 ? '5px' : '3px',
                                'margin-bottom': user.posts.length < 50 ? '5px' : '3px',
                            }"
                                :class="{ active: post == current_post }"
                                class="circle" v-for="post in user.posts"
                                @click="current_post = current_post == post ? null : post"
                            ></li>
                        </ul>
                    </div>
                </template>
                <div class="content-block" style="padding-top: 2vh; padding-bottom: 2vh;">
                    <h5> 
                        Top 3 Responders:
                    </h5>
                </div>
                <template v-for="(user, i) in responders">
                    <div class="content-block" style="padding-left: 6vw;">
                        <h6 style="width: 15vw;">
                            <styled-text :context="context">
                                {{ user.username }}
                            </styled-text>
                        </h6>
                        <h5 :style="{ color : context.color_schema[i + questioners.length] }"
                            style="width: 15vw;">
                            posts {{ user.val }} replies
                        </h5>
                        <ul style="width: 30vw; padding-top: 0.5vh;">
                            <li :style="{
                                background : context.color_schema[i],
                                width: user.posts.length < 50 ? '15px' : '12px',
                                height: user.posts.length < 50 ? '15px' : '12px',
                                'margin-right': user.posts.length < 50 ? '5px' : '3px',
                                'margin-bottom': user.posts.length < 50 ? '5px' : '3px',
                            }"
                                :class="{ active: post == current_post }"
                                class="circle" v-for="post in user.posts"
                                @click="current_post = current_post == post ? null : post"
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
    export default {
        data() {
            return {
                current_post: null,
            };
        },
        components: {
        },
        created() {
            this.context.bus.$on("add-text-box", (_id) => {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            });
            // this.table = this.render(this.item.data, this.context);
        },
        mounted() {
            // var element = this.$el.getElementsByClassName('graph')[0];
            // this.table.renderTo(element);
        },
        computed: {
            questioners() {
                return this.item.data.threads.questioners;
            },
            responders() {
                return this.item.data.threads.responders;
            },
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

.slideshow-content.upvoted {
    padding-top: 2vh;
    padding-bottom: 1vh;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

</style>