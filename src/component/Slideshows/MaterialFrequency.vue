<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slide nm-block title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slide nm-block graph" style="height: 40vh">
                <div class="p-2" :id="'tooltip' + $vnode.tag" style="opacity:0; position: absolute;"
                    :style="{
                        left: `${current_point && current_point.x}px`, 
                        top: `${current_point && (current_point.y - 5)}px` 
                    }">
                </div>
                <b-tooltip :show="show_tooltip" :target="'tooltip' + $vnode.tag">
                    {{ tooltip_message }}
                </b-tooltip>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                    The most tried video was 
                    <entity-link :id="max_video_activies.id" :context="context" :parent="item"></entity-link>
                    , each students visited the video {{ Number(max_video_activies.attempts).toFixed(1) }} times.
                </styled-text>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                    The least tried video was 
                    <entity-link :id="min_video_activies.id" :context="context" :parent="item"></entity-link>
                    , each students visited the video {{ Number(min_video_activies.attempts).toFixed(1) }} times.
                </styled-text>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                    The most tried assignment was 
                    <entity-link :id="max_assignment_activies.id" :context="context" :parent="item"></entity-link>
                    , each students submitted this assignment {{ Number(max_assignment_activies.attempts).toFixed(1) }} times.
                </styled-text>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                    The least tried assignment was 
                    <entity-link :id="min_assignment_activies.id" :context="context" :parent="item"></entity-link>
                    , each students submitted this assignment {{ Number(min_assignment_activies.attempts).toFixed(1) }} times.
                </styled-text>
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
        created() {
            this.tables.push(this.render(this.item.data, this.context));
        },
        computed: {
            max_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.max(...video_activies.map(d => d.attempts));
                return video_activies.find(d => d.attempts == t);
            },
            min_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.min(...video_activies.map(d => d.attempts));
                return video_activies.find(d => d.attempts == t);
            },
            max_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.max(...problem_activies.map(d => d.attempts));
                return problem_activies.find(d => d.attempts == t);
            },
            min_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.min(...problem_activies.map(d => d.attempts));
                return problem_activies.find(d => d.attempts == t);
            },
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video', 'assignment']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color, data.assignment_color]);

                var attemptScale = new Plottable.Scales.Linear();
                var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'))
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

                var attemptAxisLable = new Plottable.Components.AxisLabel("Frequency", "0");
                var attemptPlotLable = new Plottable.Components.AxisLabel("", "0");

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${Number(x.attempts).toFixed(2)}`);

                var table = new Plottable.Components.Table([
                    [attemptAxisLable, null],
                    [attemptAxis, plots],
                    [null, xAxis]
                ]);
                return table;
            },
        },
    };
</script>
