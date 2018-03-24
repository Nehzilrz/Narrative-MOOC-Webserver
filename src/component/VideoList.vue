<template>
    <div class="slideshow-content mooc-content text">
        <b-link href="javascript:void(0);" @click="showlist = !showlist">
            {{ !showlist ? 'Show all videos' : 'Hide' }}
        </b-link>
        <h6 v-if="showlist"> 
            Videos in this week:
        </h6>
        <div v-if="showlist">
            <ul style="list-style: none;">
                <li v-for="video in item.data.video_activies" >
                    <entity-link :id="video.id" :context="context" :parent="item">, </entity-link>
                </li>
            </ul>
        </div>
        <h6 v-if="showlist"> 
            Choose one to continue.
        </h6>
    </div>
</template>

<script>
    import Plottable from "plottable";

    export default {
        data() {
            return {
                showlist: false,
            };
        },
        props: ["item", "context"],
    };
</script>

<style scope>
</style>