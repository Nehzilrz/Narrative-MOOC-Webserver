<template>
<div>
    <div class="b4w bh nm-block upvoted">
        <div class="content-block nm-block">
            <h5> 
                Most upvoted replies:
            </h5>
        </div>
        <transition-group name="list" tag="p">
            <div class="nm-block" v-for="(thread, i) in threads" v-bind:key="i">
                <div class="content-block-parent" style="padding-left: 3vw;">
                    <div class="content-block">
                        <h6 style="width: 25vw;" @click="displayed = displayed == i ? -1 : i">
                            <styled-text :context="context">
                                {{ thread.title }}
                            </styled-text>
                        </h6>
                        <h5 :style="{ color : context.color_schema[i] }"
                            style="width: 15vw; margin-left: 5vw;
                        padding-top: .5em;">
                            upvoted {{ thread.up_count }} times
                        </h5>
                    </div>
                    <div class="content-block">
                        <transition name="fade">
                            <b-card v-if="displayed == i" style="
                                margin-left: 4vw;
                                margin-bottom: 2vh;
                                width: 100%;">
                                <p class="card-text">
                                    {{ thread.username }} : {{ thread.body }}
                                </p>
                            </b-card>
                        </transition>
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</div>
</template>

<script>
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
                displayed: -1,
            };
        },
        extends: SlideshowBase,
        computed: {
            threads() {
                return this.item.data.threads.slice(0, 5);
            },
        },
        methods: {
        },
    };
</script>

<style scope>
.slide.text h6 {
    font-weight: 600;
}

.slide.upvoted {
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