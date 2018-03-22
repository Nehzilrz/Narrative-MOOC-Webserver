<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content learner-profile">
                <div class="content-block">
                    <div class="circle" v-for="k in difficulties">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                            <path :fill="context.color_schema[0]" d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"/>
                        </svg>
                    </div>
                    <h3 :style="{ color : context.color_schema[0] }"
                        style="padding-left:1vw;padding-right:2vw">
                        {{ difficulties.length }} students
                    </h3>
                    <h5>
                    spend
                        {{ ~~(difficulties.map(d => d.time).reduce((a, b) => a + b, 0) / difficulties.length / 60) }}
                        minutes in average but got grade less than 2 in this chapter.
                    </h5>
                </div>
                <div class="content-block">
                    <div class="circle" v-for="k in difficulties2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                            <path :fill="context.color_schema[1]" d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"/>
                        </svg>
                    </div>
                    <h3 :style="{ color : context.color_schema[1] }"
                        style="padding-left:1vw;padding-right:2vw">
                        {{ difficulties2.length }} students
                    </h3>
                    <h5>
                    spend
                        {{~~(difficulties2.map(d => d.time).reduce((a, b) => a + b, 0) / difficulties2.length / 60)}} minutes
                        in average but got grade zero in this chapter.
                    </h5>
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
                show_tooltip: false,
                tooltip_message: 'Hello World',
                current_point: {},
                table: null,
                lastElement: null,
            };
        },
        created() {
            this.context.bus.$on("add-text-box", this.handle);
        },
        destroyed() {
            this.context.bus.$off("add-text-box", this.handle);
        },
        mounted() {
        },
        computed: {
            useless() {
                /*
                data.education_highest_name = education_data[0].name;
                data.education_highest_val = Number(education_data[0].val / education_data_sum * 100).toFixed(1) + '%';

                data.gender_highest_name = gender_data[0].name;
                data.gender_highest_val = Number(gender_data[0].val / gender_data_sum * 100).toFixed(1) + '%';
*/
            },
            info() {
                return this.item.data.difficulties;
            },
            users() {
                return this.info.users;
            },
            difficulties() {
                const avg_time = this.users.map(d => d.time).reduce((a, b) => a + b, 0) / this.users.length;
                return this.users.filter(
                    d => d.grade <= 2 && d.time > avg_time * 1.2
                );
            },
            difficulties2() {
                const avg_time = this.users.map(d => d.time).reduce((a, b) => a + b, 0) / this.users.length;
                return this.users.filter(
                    d => d.grade == 0 && d.time > avg_time
                );
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
            }
        },
        props: ["item", "context", "step"],
    };
</script>

<style scope>
.slideshow-content.text h6 {
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

.slideshow-content.learner-profile {
    padding-top: 2vh;
    padding-bottom: 1vh;
    padding-left: 2vh;
    flex-direction: column;
    display: flex;
    position: relative;
}

</style>