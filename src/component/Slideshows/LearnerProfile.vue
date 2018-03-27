<template>
<div>
    <div class="b4w bh nm-block learner-profile">
        <div class="b4w bh nm-block">
            <styled-text :context="context">
                Country:
            </styled-text>
            <b-progress class="mt-1" height="2.5rem" :max="country.n">
                <b-progress-bar v-for="item, i in country_list"
                    @mouseover.native="mouseover"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="item.name"
                    :title="`${item.val} ${item.name} learners, ${Number(item.val/country.n*100).toFixed(2)}%`">
                </b-progress-bar>
                <b-progress-bar
                    :value="country.n - country_list.map(d => d.val).reduce((a, b) => a + b)"
                    :style="{'background-color': 'lightgray'}">
                    Other
                </b-progress-bar>
            </b-progress>
            <!--
            <b-progress class="mt-1" height="2.5rem">
                <b-progress-bar v-for="item, i in country_list"
                    @click.native=""
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="item.val">
                </b-progress-bar>
                <b-progress-bar
                    :style="{'background-color': '#e9ecef'}"
                    :value="country.n / 10"
                    :label="country.n - country_list.map(d => d.val).reduce((a, b) => a + b)">
                </b-progress-bar>
            </b-progress>
            -->
        </div>
        <div class="b4w bh nm-block">
            <styled-text :context="context">
                Gender:
            </styled-text>
            <b-progress class="mt-1" height="2.5rem" :max="country.n">
                <b-progress-bar v-for="item, i in gender_list"
                    @mouseover.native="mouseover"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="gender_mapping(item.name)"
                    :title="`${item.val} ${gender_mapping(item.name)} learners, ${Number(item.val/gender.n*100).toFixed(2)}%`">
                </b-progress-bar>
                <b-progress-bar
                    :value="gender.n - gender_list.map(d => d.val).reduce((a, b) => a + b)"
                    :style="{'background-color': 'lightgray'}">
                    Other
                </b-progress-bar>
            </b-progress>
        </div>
        <div class="b4w bh nm-block">
            <styled-text :context="context">
                Student drop or not:
            </styled-text>
            <b-progress class="mt-1" height="2.5rem" :max="drop.n">
                <b-progress-bar v-for="item, i in drop_list"
                    @mouseover.native="mouseover"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="item.name"
                    :title="`${item.val} ${item.name} learners, ${Number(item.val/drop.n*100).toFixed(2)}%`">
                </b-progress-bar>
                <b-progress-bar
                    :value="drop.n - drop_list.map(d => d.val).reduce((a, b) => a + b)"
                    :style="{'background-color': 'lightgray'}">
                    Other
                </b-progress-bar>
            </b-progress>
        </div>
        <div class="b4w bh nm-block">
            <styled-text :context="context">
                Study mode:
            </styled-text>
            <b-progress class="mt-1" height="2.5rem" :max="mode.n">
                <b-progress-bar v-for="item, i in mode_list"
                    @mouseover.native="mouseover"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="item.name"
                    :title="`${item.val} ${item.name} learners, ${Number(item.val/mode.n*100).toFixed(2)}%`">
                </b-progress-bar>
            </b-progress>
        </div>
        <div class="b4w bh nm-block">
            <styled-text :context="context">
                Education background:
            </styled-text>
            <b-progress class="mt-1" height="2.5rem" :max="education.n">
                <b-progress-bar v-for="item, i in education_list"
                    @mouseover.native="mouseover"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="item.val > education.n * 0.05 ? education_mapping(item.name): ''"
                    :title="`${item.val} ${education_mapping(item.name)} learners, ${Number(item.val/education.n*100).toFixed(2)}%`">
                </b-progress-bar>
                <b-progress-bar
                    :value="education.n - education_list.map(d => d.val).reduce((a, b) => a + b)"
                    :style="{'background-color': 'lightgray'}">
                    Other
                </b-progress-bar>
            </b-progress>
        </div>
        <div class="b4w bh nm-block">
            <styled-text :context="context">
                Age:
            </styled-text>
            <b-progress class="mt-1" height="2.5rem" :max="age.n">
                <b-progress-bar v-for="item, i in age_list"
                    @mouseover.native="mouseover"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :title="`${item.val} ${item.name*10-10} - ${item.name*10} learners, ${Number(item.val/age.n*100).toFixed(2)}%`">
                    {{ item.name * 10 - 10}} - {{ item.name * 10}}
                </b-progress-bar>
                <b-progress-bar
                    :value="age.n - age_list.map(d => d.val).reduce((a, b) => a + b)"
                    :style="{'background-color': 'lightgray'}">
                    Above
                </b-progress-bar>
            </b-progress>
        </div>
    </div>
</div>
</template>

<script>
    import Plottable from "plottable";
    import SlideshowBase from "./SlideshowBase.vue";
    import { color_schema } from "../../lib/colors";

    export default {
        data() {
            return {
                counter: 45,
                max: 100,
                color_schema: color_schema,
            };
        },
        extends: SlideshowBase,
        methods: {
        },
        computed: {
            info() {
                return this.data.user_info;
            },
            country() {
                return this.info.find(d => d.key == 'country_name');
            },
            country_list() {
                return this.country.val
                    .sort((a, b) => b.val - a.val)
                    .slice(0, 8);
            },
            gender() {
                return this.info.find(d => d.key == 'gender');
            },
            gender_list() {
                return this.gender.val
                    .sort((a, b) => b.val - a.val)
                    .slice(0, 2);
            },
            mode() {
                return this.info.find(d => d.key == 'mode');
            },
            mode_list() {
                return this.mode.val
                    .sort((a, b) => b.val - a.val);
            },
            drop() {
                return this.info.find(d => d.key == 'drop');
            },
            drop_list() {
                return this.drop.val
                    .sort((a, b) => b.val - a.val);
            },
            education() {
                return this.info.find(d => d.key == 'level_of_education');
            },
            education_list() {
                return this.education.val
                    .sort((a, b) => b.val - a.val)
                    .filter(d => this.education_mapping(d.name) != 'other');
            },
            age() {
                return this.info.find(d => d.key == 'age');
            },
            age_list() {
                return this.age.val
                    .sort((a, b) => +a.name - +b.name)
                    .slice(0, 7);
            },
        },
        methods: {
            mouseover(e) {
                const message = e.target.attributes.title.nodeValue;
                const element = this.$el.getBoundingClientRect();
                const position = {
                    x: e.clientX - element.left,
                    y: e.clientY - element.top,
                };
                const event = {
                    message,
                    position,
                    time: new Date(),
                };
                this.$emit('showtooltip', event);
            },
            gender_mapping(name) {
                if (name == 'f') {
                    name = 'Female';
                } else if (name == 'm') {
                    name = 'Male';
                }
                return name;
            },
            education_mapping(name) {
                if (name == 'none') {
                    name = 'None'
                } else if (name == 'm') {
                    name = 'Master';
                } else if (name == 'b') {
                    name = 'Bechelor';
                } else if (name == 'el') {
                    name = 'Elementary School';
                } else if (name == 'hs') {
                    name = 'High School';
                } else if (name == 'jhs') {
                    name = 'Junior High School';
                } else name = 'other';
                return name;
            },
        },
    };
</script>

<style scope>

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