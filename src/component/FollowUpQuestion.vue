<template>
    <div class="slideshow-content text" v-if="item.follow_ups.length > 0">
        <h6>
            Follow up questions:
        </h6>
        <ul>
            <li v-for="q in context.followupSlides(item)">
                <b-link href="javascript:void(0);" @click="context.loadSlide(q.type, item.resource_id, item)">
                    {{ q.name }}
                </b-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        computed: {
        },
        methods: {
        },
        props: ["item", "context"],
    };
</script>

<style scope>
</style>