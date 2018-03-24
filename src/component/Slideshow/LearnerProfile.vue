<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content mooc-content title">
                <h4> {{ item.name }} of these {{ users.length }} students </h4>
            </div>
            <div class="slideshow-content mooc-content learner-profile">
                <div class="content-block mooc-content">
                    <h6 style="width: 25vw;">
                        <styled-text :context="context">
                            Gender distribution:
                        </styled-text>
                    </h6>
                </div>
                <div class="content-block mooc-content detail" v-for="x, i in gender">
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 15vw;">
                        {{ x.name }}
                    </h5>
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 5vw;">
                        {{ Number(x.val.length / gender_sum * 100).toFixed(1) }}%
                    </h5>
                    <ul style="width: 40vw">
                        <div class="circle" v-for="k in x.val">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                <path :fill="context.color_schema[i]" d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"/>
                            </svg>
                        </div>
                    </ul>
                </div>
                <div class="content-block mooc-content">
                    <h6 style="width: 25vw;">
                        <styled-text :context="context">
                            Age distribution:
                        </styled-text>
                    </h6>
                </div>
                <div class="content-block mooc-content detail" v-for="x, i in age">
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 15vw;">
                        {{ x.name }}
                    </h5>
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 5vw;">
                        {{ Number(x.val.length / age_sum * 100).toFixed(1) }}%
                    </h5>
                    <ul style="width: 40vw;">
                        <div class="circle" v-for="k in x.val">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                <path :fill="context.color_schema[i]" d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"/>
                            </svg>
                        </div>
                    </ul>
                </div>
                <div class="content-block mooc-content">
                    <h6 style="width: 25vw;">
                        <styled-text :context="context">
                            Education background distribution:
                        </styled-text>
                    </h6>
                </div>
                <div class="content-block detail" v-for="x, i in education">
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 15vw;">
                        {{ x.name }}
                    </h5>
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 5vw;">
                        {{ Number(x.val.length / education_sum * 100).toFixed(1) }}%
                    </h5>
                    <ul style="width: 40vw;">
                        <div class="circle" v-for="k in x.val">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                <path :fill="context.color_schema[i]" d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"/>
                            </svg>
                        </div>
                    </ul>
                </div>
                <div class="content-block mooc-content">
                    <h6 style="width: 25vw;">
                        <styled-text :context="context">
                            Country distribution:
                        </styled-text>
                    </h6>
                </div>
                <div class="content-block mooc-content detail" v-for="x, i in [['China', 39.2], ['United States', 17.8], ['Europe', 26.5], ['Other', 16.4]]">
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 15vw;">
                        {{ x[0] }}
                    </h5>
                    <h5 :style="{ color : context.color_schema[i] }"
                        style="width: 5vw;">
                        {{ Number(x[1]).toFixed(1) }}%
                    </h5>
                    <ul style="width: 40vw;">
                        <div class="circle" v-for="k in (~~(x[1] / 100 * users.length))">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
                                <path :fill="context.color_schema[i]" d="M96 0c35.346 0 64 28.654 64 64s-28.654 64-64 64-64-28.654-64-64S60.654 0 96 0m48 144h-11.36c-22.711 10.443-49.59 10.894-73.28 0H48c-26.51 0-48 21.49-48 48v136c0 13.255 10.745 24 24 24h16v136c0 13.255 10.745 24 24 24h64c13.255 0 24-10.745 24-24V352h16c13.255 0 24-10.745 24-24V192c0-26.51-21.49-48-48-48z"/>
                            </svg>
                        </div>
                    </ul>
                </div>
            </div>
            <follow-up :item="item" :context="context"></follow-up>
        </template>
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
                return this.item.data.user_info;
            },
            education() {
                return this.info.education;
            },
            education_sum() {
                return this.info.education.map(d => d.val.length).reduce((a, b) => a + b, 0);
            },
            age() {
                return this.info.age;
            },
            age_sum() {
                return this.info.age.map(d => d.val.length).reduce((a, b) => a + b, 0);
            },
            gender() {
                return this.info.gender;
            },
            gender_sum() {
                return this.info.gender.map(d => d.val.length).reduce((a, b) => a + b, 0);
            },
            users() {
                return this.info.users;
            }
        },
        methods: {
        },
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