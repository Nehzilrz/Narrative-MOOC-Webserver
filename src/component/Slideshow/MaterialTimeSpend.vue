<template>
    <div class="slideshow-page">
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content graph" style="height: 25vh">
            </div>
            <div class="slideshow-content text">
                <h6> 
                    Time cost in this week:
                </h6>
                <ul>
                <li>
                    <styled-text :context="context" v-if="max_video && max_video.length > 0">
                        The video with highest watch time on average is
                        <entity-link :id="max_video[0].id" :context="context" :parent="item"></entity-link>
                        , which has been watched {{ Number(max_video[0].time).toFixed(1) }} minutes.
                    </styled-text>
                    <styled-text :context="context" v-if="min_video && min_video.length > 0">
                        The video with lowest watch time on average is
                        <entity-link :id="min_video[0].id" :context="context" :parent="item"></entity-link>
                        , which has been watched {{ Number(min_video[0].time).toFixed(1) }} minutes.
                    </styled-text>
                    </li>
                    <li>
                    <styled-text :context="context" v-if="max_assignment && max_assignment.length > 0">
                        The assignment with highest working time on average is
                        <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                        , which has been work {{ Number(max_assignment[0].time).toFixed(1) }} minutes.
                    </styled-text>
                    <styled-text :context="context" v-if="min_assignment && min_assignment.length > 0">
                        The assignment with lowest working time  on average is
                        <entity-link :id="min_assignment[0].id" :context="context" :parent="item"></entity-link>
                        , which has been work {{ Number(min_assignment[0].time).toFixed(1) }} minutes.
                    </styled-text>
                    </li>
                </ul>
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
                table: null,
            };
        },
        created() {
            this.table = this.render(this.item.data, this.context);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
        },
        computed: {
            max_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, time: d.video_watch_time / 60 }))
                    .sort((a, b) => b.time - a.time)
                    .slice(0, 1);
            },
            min_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, time: d.video_watch_time / 60 }))
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 1);
            },
            max_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, time: d.work_time / 60 }))
                    .sort((a, b) => b.time - a.time)
                    .slice(0, 1);
            },
            min_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, time: d.work_time / 60 }))
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 1);
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

                var timeCostScale = new Plottable.Scales.Linear();
                var timeAxis = new Plottable.Axes.Numeric(timeCostScale, "left").xAlignment("left");
                
                var plot = new Plottable.Plots.Bar()
                    .y((d, i, dataset) => dataset.metadata() == 'video' ?
                        d.video_watch_time : d.work_time, timeCostScale
                    )
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'))
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

                var timeAxisLable = new Plottable.Components.AxisLabel("time-cost", "0");
                var plotLable = new Plottable.Components.AxisLabel("", "0");

                var table = new Plottable.Components.Table([
                    [timeAxisLable, null],
                    [timeAxis, plot],
                    [null, xAxis]
                ]);
                return table;
            },
        },
        props: ["item", "context"],
    };
</script>

<style scope>
.slideshow-content.text h6 {
    font-weight: 600;
}
</style>