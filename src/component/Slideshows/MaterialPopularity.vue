<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slide nm-block title">
                <h3> {{ item.name }} </h3>
            </div>
            <div class="slide nm-block graph" style="height: 40vh;">
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
                    The most visited video was 
                    <entity-link :id="max_video_activies.id" :context="context" :parent="item"></entity-link>
                    , {{ max_video_activies.activeness }} 
                    students visited the video.
                </styled-text>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                The least visited video was 
                <entity-link :id="min_video_activies.id" :context="context" :parent="item"></entity-link>
                , {{ min_video_activies.activeness }} 
                students visited the video.
                </styled-text>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                The most visited assignment was 
                <entity-link :id="max_assignment_activies.id" :context="context" :parent="item"></entity-link>
                , {{ max_assignment_activies.activeness }} 
                students visited the assignment.
                </styled-text>
            </div>
            <div class="slide nm-block text">
                <styled-text :context="context">
                The least visited assignment was 
                <entity-link :id="min_assignment_activies.id" :context="context" :parent="item"></entity-link>
                , {{ min_assignment_activies.activeness }} 
                students visited the assignment.
                </styled-text>
            </div>
            <follow-up :item="item" :context="context"></follow-up>
        </template>
    </div>
</template>

<script>
    import SlideshowBase from "./SlideshowBase.vue";
    import Plottable from "plottable";

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
                const t = Math.max(...video_activies.map(d => d.activeness));
                return video_activies.find(d => d.activeness == t);
            },
            min_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.min(...video_activies.map(d => d.activeness));
                return video_activies.find(d => d.activeness == t);
            },
            max_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.max(...problem_activies.map(d => d.activeness));
                return problem_activies.find(d => d.activeness == t);
            },
            min_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.min(...problem_activies.map(d => d.activeness));
                return problem_activies.find(d => d.activeness == t);
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

                var activenessScale = new Plottable.Scales.Linear();
                var activenessAxis = new Plottable.Axes.Numeric(activenessScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.activeness, activenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .attr("opacity", 0.8)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'))
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(1);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${x.activeness}`);

                var yLabel = new Plottable.Components.AxisLabel("Popularity", "0");

                var table = new Plottable.Components.Table([
                    [yLabel, legend],
                    [activenessAxis, plots],
                    [null, xAxis]
                ]);

                return table;
            },
        },
    };
</script>

<style scope>
.slide.text h6 {
    font-weight: 600;
}
</style>