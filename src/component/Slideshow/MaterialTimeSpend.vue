<template>
    <div class="slideshow-page">
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content graph" style="height: 25vh">
            </div>
            <div class="slideshow-content text">
                <ul>
                    <li>
                        The video with highest watch time on average is
                        <entity-link :id="most_watch[0].id" :context="context"></entity-link>
                        , which has been watched {{ Number(most_watch[0].watch_time).toFixed(1) }} minutes.
                    </li>
                    <li>
                        The video with lowest watch time on average is
                        <entity-link :id="least_watch[0].id" :context="context"></entity-link>
                        , which has been watched {{ Number(least_watch[0].watch_time).toFixed(1) }} minutes.
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
            this.$sr.reveal(".slideshow-content", {
                duration: 500,
                viewFactor: 0.4,
                rotate: { x: 65 },
            });
        },
        computed: {
            most_watch() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
                    .sort((a, b) => b.watch_time - a.watch_time)
                    .slice(0, 3);
            },
            least_watch() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
                    .sort((a, b) => a.watch_time - b.watch_time)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var watchTimeScale = new Plottable.Scales.Linear();
                var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
                watchTimeAxis.formatter((d) => Number(d / 60).toFixed(1))
                var watchTimePlot = new Plottable.Plots.Bar()
                    .y(d => d.video_watch_time, watchTimeScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[7])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies));

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

                var table = new Plottable.Components.Table([
                    [watchTimeLabel, null],
                    [watchTimeAxis, watchTimePlot],
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