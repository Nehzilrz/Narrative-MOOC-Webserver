<template>
    <div class="slide nm-block text" v-if="item.follow_ups.length > 0">
        <h5>
            Follow up questions:
        </h5>
        <ul>
            <li v-for="q in followupSlides(item)">
                <b-link href="javascript:void(0);"
                @click="$bus.$emit('load_slide', q.type, item.resource_id, item)">
                    {{ q.name }}
                </b-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import * as SlideTemplate from "../../lib/slidetemplate";
    
    export default {
        data() {
            return {
            };
        },
        computed: {
        },
        methods: {
            followupSlides(slide) {
                return slide.follow_ups.map(d => ({
                    name: SlideTemplate.questions[d],
                    type: d,
                }));
            }
        },
        props: ["item"],
    };
</script>

<style scope>
</style>