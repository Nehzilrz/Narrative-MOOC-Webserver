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
                Activies in this week:
            </h6>
            <ul>
                <li v-if="max_video_activies">
                    The most tried video was 
                    <entity-link :id="max_video_activies.id" :context="context" :parent="item"></entity-link>
                    , each students visited the video {{ Number(max_video_activies.attempts).toFixed(1) }} times.
                </li>
                <li v-if="min_video_activies">
                    The least tried video was 
                    <entity-link :id="min_video_activies.id" :context="context" :parent="item"></entity-link>
                    , each students visited the video {{ Number(min_video_activies.attempts).toFixed(1) }} times.
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
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color]);

                var attemptScale = new Plottable.Scales.Linear();
                var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
                var attemptPlot = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'));

                var attemptAxisLable = new Plottable.Components.AxisLabel("Frequency", "0");
                var attemptPlotLable = new Plottable.Components.AxisLabel("", "0");

                var table = new Plottable.Components.Table([
                    [attemptAxisLable, null],
                    [attemptAxis, attemptPlot],
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