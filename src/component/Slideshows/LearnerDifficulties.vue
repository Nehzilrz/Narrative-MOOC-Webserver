<template>
<div>
    <div class="b4w bh nm-block learner-profile">
        <div class="content-block nm-block">
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
        <div class="content-block nm-block">
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
        extends: SlideshowBase,
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
                return this.data.difficulties;
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