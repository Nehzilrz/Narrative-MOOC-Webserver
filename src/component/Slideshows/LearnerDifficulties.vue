<template>
<div>
<!--
    <div class="b4w bh nm-block learner-profile">
        <styled-text :context="context">
            No enough practice:
        </styled-text>
        <b-progress class="mt-1" height="2.5rem" :max="nopractice.n">
            <b-progress-bar v-for="item, i in nopractice.list"
                @mouseover.native="mouseover"
                @click.native="mouseover"
                :style="{'background-color': color_schema[i % color_schema.length]}"
                :value="item.val"
                :label="item.name"
                :title="`${item.val} ${item.name} learners, ${Number(item.val/nopractice.n*100).toFixed(2)}%`">
            </b-progress-bar>
        </b-progress>
    </div>
    <div class="b4w bh nm-block learner-profile">
        <styled-text :context="context">
            Having difficulties:
        </styled-text>
        <b-progress class="mt-1" height="2.5rem" :max="difficulties.n">
            <b-progress-bar v-for="item, i in difficulties.list"
                @mouseover.native="mouseover"
                @click.native="mouseover"
                :style="{'background-color': color_schema[i % color_schema.length]}"
                :value="item.val"
                :label="item.name"
                :title="`${item.val} ${item.name} learners, ${Number(item.val/difficulties.n*100).toFixed(2)}%`">
            </b-progress-bar>
        </b-progress>
    </div>
    -->
    <div class="nm-block b4w bh learner-profile">
        <styled-text :context="context">
            Performance distribution this week: 
        </styled-text>
    </div>
    <div class="graph nm-block learnerdifficulties b4w b3h" ref="graph1">
    </div>
    <div class="nm-block b4w bh learner-profile">
        <styled-text :context="context">
        Performance distribution this semister:
        </styled-text>
    </div>
    <div class="graph nm-block learnerdifficulties b4w b3h" ref="graph2">
    </div>
        <div class="b4w b1h nm-block">
            <b-button @click="show_extra = !show_extra" :variant="!show_extra ? 'danger' : 'primary'">
            {{ !show_extra ? 
                'Customize Your Learner Group' : 'Hide'
            }} 
            </b-button>
        </div>
        <div class="b4w bh nm-block" v-show="show_extra">
        <h5 style="padding-bottom: 1em">
            Customize Your Learner Group:
        </h5>
        <b-container fluid>
            <b-row class="learner-profile row">
                <b-col sm="4">
                Country:
                </b-col>
                <b-col sm="8">
                <multiselect
                    v-model="country_filter"
                    :options="country_options"
                    :multiple="true"
                    :close-on-select="true"
                    label="name"
                    track-by="name"
                    placeholder="">
                </multiselect>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                Gender:
                </b-col>
                <b-col sm="8">
                <multiselect
                    v-model="gender_filter"
                    :options="gender_options"
                    :multiple="true"
                    :close-on-select="true"
                    label="name"
                    track-by="name"
                    placeholder="">
                </multiselect>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                Learner study mode:
                </b-col>
                <b-col sm="8">
                <multiselect
                    v-model="mode_filter"
                    :options="mode_options"
                    :multiple="true"
                    :close-on-select="true"
                    label="name"
                    track-by="name"
                    placeholder="">
                </multiselect>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                Learner drop or not:
                </b-col>
                <b-col sm="8">
                <multiselect
                    v-model="drop_filter"
                    :options="drop_options"
                    :multiple="true"
                    :close-on-select="true"
                    label="name"
                    track-by="name"
                    placeholder="">
                </multiselect>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                Learner educational background:
                </b-col>
                <b-col sm="8">
                <multiselect
                    v-model="education_filter"
                    :options="education_options"
                    :multiple="true"
                    :close-on-select="true"
                    label="name"
                    track-by="name"
                    placeholder="">
                </multiselect>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                    Age:
                </b-col>
                <b-col sm="3">
                <b-form-input v-model="start_age"
                    type="number" class="number"
                    size="sm"
                    placeholder="Age range from">
                </b-form-input>
                </b-col>
                <b-col sm="1">
                to
                </b-col>
                <b-col sm="3">
                <b-form-input v-model="end_age"
                    type="number" class="number"
                    size="sm"
                    placeholder="Age range to">
                </b-form-input>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                    Grade:
                </b-col>
                <b-col sm="3">
                <b-form-input v-model="start_grade"
                    type="number" class="number"
                    size="sm"
                    placeholder="grade range from">
                </b-form-input>
                </b-col>
                <b-col sm="1">
                to
                </b-col>
                <b-col sm="3">
                <b-form-input v-model="end_grade"
                    type="number" class="number"
                    size="sm"
                    placeholder="grade range to">
                </b-form-input>
                </b-col>
            </b-row>
            <b-row class="learner-profile row">
                <b-col sm="4">
                </b-col>
                <b-col sm="4">
                    <b-button size="sm" @click="countCondition()">
                        Count number of learner in this group 
                    </b-button> 
                    {{ count_value }} 
                </b-col>
                <b-col sm="2">
                    <b-form-input v-model="group_name"
                        type="text"
                        size="sm"
                        placeholder="Enter group name">
                    </b-form-input>
                </b-col>
                <b-col sm="2"> 
                    <b-button-group 
                        size="sm">
                        <b-button @click="addGroup()"> Add Group </b-button>
                    </b-button-group>
                </b-col>
            </b-row>
        </b-container>
        </div>
</div>
</template>

<script>
    import { color_schema } from "../../lib/colors";
    import SlideshowBase from "./SlideshowBase.vue";
    import Plottable from "plottable";
    import { serverUrl } from "../../lib/request";
    import axios from 'axios';
    import Multiselect from 'vue-multiselect';

    export default {
        data() {
            return {
                counter: 45,
                max: 100,
                country_filter: [],
                gender_filter: [],
                mode_filter: [],
                drop_filter: [],
                education_filter: [],
                count_value: 0,
                show_extra: false,
                group_name: '',
                start_age: 0,
                end_age: 99,
                start_grade: 0,
                end_grade: 100,
                show_country: false,
                show_age: false,
                color_schema,
            };
        },
        extends: SlideshowBase,
        created() {
            this.tables.push(this.render1(this.data, this.context));
            this.tables.push(this.render2(this.data, this.context));
        },
        components: {
            Multiselect,
        },
        methods: {
            addGroup() {
                this.context.options.push(   
                    { name: this.group_name, 
                        value: () => Object.keys(this.cond).map(
                            d => ({ key: d, rule: this.cond[d] })
                        )
                    });
            },
            countCondition() {
                console.log(this.cond);
                axios.post(`${serverUrl}getUserNumber`, {
                    condition: this.cond,
                    chapter: this.context.current_chapter.id,
                })
                .then((response) => {
                    this.count_value = response.data;
                });
            },
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
            },
            render1(data, context) {
                data = this.overall_week;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var yScale = new Plottable.Scales.Linear();
                var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.val, yScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[9])
                    .addDataset(new Plottable.Dataset(data));
                
                var Label = new Plottable.Components.AxisLabel("Number", "0");
                xAxis.formatter(d => {
                    if (d == 0) {
                        return 'No Grade';
                    } else {
                        return d;
                    };
                });

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, d => `value: ${Number(d.val).toFixed(2)}`,
                    () => ({
                        x: this.$refs.graph1.getBoundingClientRect().x - this.$el.getBoundingClientRect().x,
                        y: this.$refs.graph1.getBoundingClientRect().y - this.$el.getBoundingClientRect().y,
                    }));

                var table = new Plottable.Components.Table([
                    [Label, null],
                    [yAxis, plots],
                    [null, xAxis],
                ]);
                return table;
            },
            render2(data, context) {
                data = this.overall_semister;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var yScale = new Plottable.Scales.Linear();
                var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.val, yScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[8])
                    .addDataset(new Plottable.Dataset(data));
                
                var Label = new Plottable.Components.AxisLabel("Number", "0");

                xAxis.formatter(d => {
                    return `${d * 10}% - ${d * 10 + 10}%`;
                });

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, d => `value: ${Number(d.val).toFixed(2)}`,
                    () => ({
                        x: this.$refs.graph2.getBoundingClientRect().x - this.$el.getBoundingClientRect().x,
                        y: this.$refs.graph2.getBoundingClientRect().y - this.$el.getBoundingClientRect().y,
                    }));

                var table = new Plottable.Components.Table([
                    [Label, null],
                    [yAxis, plots],
                    [null, xAxis],
                ]);
                return table;
            },
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
        },
        computed: {
            difficuly() {
                return this.data.difficulties.sort((a, b) => a.time - b.time);
            },
            info() {
                return this.data.user_info;
            },
            overall_week() {
                const users = this.difficuly;
                const count = {};
                for (const user of users) {
                    let val;
                    val = user.grade || 0;
                    if (!count[val]) count[val] = 0;
                    count[val] += 1;
                }
                const list = Object.keys(count).map(d => ({ name: d, val: count[d] }));
                return list;
            },
            overall_semister() {
                const users = this.difficuly;
                const count = {};
                for (const user of users) {
                    let val;
                    val = ~~(user.final * 9.99) || 0;
                    if (!count[val]) count[val] = 0;
                    count[val] += 1;
                }
                const list = Object.keys(count).map(d => ({ name: d, val: count[d] }));
                return list;
            },
            cond() {
                const condition = {};
                condition['year_of_birth'] = {
                    $gte: 2014 - this.end_age, 
                    $lte: 2014 - this.start_age,
                };
                if (this.country_filter.length) {
                    condition['country_name'] = { '$in' : this.country_filter.map(d => d.val)};
                }
                if (this.mode_filter.length) {
                    condition['mode'] = { '$in' : this.mode_filter.map(d => d.val)};
                }
                if (this.education_filter.length) {
                    condition['level_of_education'] = { '$in' : this.education_filter.map(d => d.val)};
                }
                if (this.gender_filter.length) {
                    condition['gender'] = { '$in' : this.gender_filter.map(d => d.val)};
                }
                condition['grade'] = {
                    $gte: this.start_grade * 0.01,
                    $lte: this.end_grade * 0.01,
                };
                return condition;
            },
            country() {
                return this.info.find(d => d.key == 'country_name');
            },
            country_list() {
                return this.country.val
                    .sort((a, b) => b.val - a.val)
                    .slice(0, 8);
            },
            country_options() {
                return this.country.val.map(d => ({
                    name: d.name,
                    val: d.name,
                }))
            },
            gender() {
                return this.info.find(d => d.key == 'gender');
            },
            gender_list() {
                return this.gender.val
                    .sort((a, b) => b.val - a.val)
                    .slice(0, 2);
            },
            gender_options() {
                return this.gender_list.map(d => ({
                    name: this.gender_mapping(d.name),
                    val: d.name,
                }))
            },
            mode() {
                return this.info.find(d => d.key == 'mode');
            },
            mode_list() {
                return this.mode.val
                    .sort((a, b) => b.val - a.val);
            },
            mode_options() {
                return this.mode_list.map(d => ({
                    name: this.mode_mapping(d.name),
                    val: d.name,
                }))
            },
            drop() {
                return this.info.find(d => d.key == 'drop');
            },
            drop_list() {
                return this.drop.val
                    .sort((a, b) => b.val - a.val);
            },
            drop_options() {
                return this.drop_list.map(d => ({
                    name: this.drop_mapping(d.name),
                    val: d.name,
                }))
            },
            education() {
                return this.info.find(d => d.key == 'level_of_education');
            },
            education_list() {
                return this.education.val
                    .sort((a, b) => b.val - a.val)
                    .filter(d => this.education_mapping(d.name) != 'other');
            },
            education_options() {
                return this.education_list.map(d => ({
                    name: this.education_mapping(d.name),
                    val: d.name,
                }))
            },
            age() {
                return this.info.find(d => d.key == 'age');
            },
            age_list() {
                return this.age.val
                    .sort((a, b) => +a.name - +b.name)
                    .slice(0, 7);
            },
            grade() {
                return this.info.find(d => d.key == 'grade');
            },
            grade_list() {
                return this.grade.val
                    .sort((a, b) => +a.name - +b.name)
                    .slice(0, 10);
            },
            nopractice() {
                const users = this.difficuly.slice(0, this.difficuly.length * 0.2);
                const count = {};
                for (const user of users) {
                    let val;
                    val = user.grade || 0;
                    if (!count[val]) count[val] = 0;
                    count[val] += 1;
                }
                const list = Object.keys(count).map(d => ({ name: d, val: count[d] }));
                return {
                    list,
                    n: list.map(d => d.val).reduce((a, b) => a + b),
                };
            },
            difficulties() {
                const users = this.difficuly.slice(this.difficuly.length * 0.8);
                const count = {};
                for (const user of users) {
                    let val;
                    val = user.grade || 0;
                    if (!count[val]) count[val] = 0;
                    count[val] += 1;
                }
                const list = Object.keys(count).map(d => ({ name: d, val: count[d] }));
                return {
                    list,
                    n: list.map(d => d.val).reduce((a, b) => a + b),
                };
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

.learnerdifficulties.graph {
    margin-left: 2em;
    margin-right: 1em;
}

.current_filter input.number {
    width: 4em;
    margin-left: 1em;
    margin-right: 1em;
}
.learner-profile.row {
    padding-top: .5em;
    padding-bottom: .5em;
}
</style>