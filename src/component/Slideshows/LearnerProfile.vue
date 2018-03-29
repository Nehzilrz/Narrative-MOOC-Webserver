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
                    :class="{}"
                    @click.native="select_country = item == select_country ? null : item"
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
                    @click.native="select_gender = item == select_gender ? null : item"
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
                    @click.native="select_drop = item == select_drop ? null : item"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="drop_mapping(item.name)"
                    :title="`${item.val} ${drop_mapping(item.name)} learners, ${Number(item.val/drop.n*100).toFixed(2)}%`">
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
                    @click.native="select_mode = item == select_mode ? null : item"
                    :style="{'background-color': color_schema[i]}"
                    :value="item.val"
                    :label="mode_mapping(item.name)"
                    :title="`${item.val} ${mode_mapping(item.name)} learners, ${Number(item.val/mode.n*100).toFixed(2)}%`">
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
                    @click.native="select_education = item == select_education ? null : item"
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
                    @click.native="select_age = item == select_age ? null : item"
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
                select_age: null,
                select_education: null,
                select_gender: null,
                select_country: null,
                select_mode: null,
                select_drop: null,
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
                const title = e.target.attributes.title;
                if (!title) return;
                const message = e.target.attributes.title.nodeValue;
                const element = this.$el.getBoundingClientRect();
                const position = {
                    x: e.clientX - element.left - 50,
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
            drop_mapping(name) {
                if (name == 'drop') {
                    return 'Dropped';
                } else {
                    return 'Continued';
                }
            },
            mode_mapping(name) {
                return name.charAt(0).toUpperCase() + name.slice(1);
            }
        },
    };
</script>

<style scope>

.progress-bar {
    opacity: 0.9!important;
}
.progress-bar:hover,.progress-bar.active {
    border: rgba(0, 0, 0, 0.3);
    border-width: 4px;
    border-style: solid;
    box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 0.5);
}
.progress-bar:hover {
    opacity: 1!important;
}

</style>