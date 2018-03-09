<template>
    <div class="slideshow-page">
        <div class="slideshow-content title">
            <h4> {{ item.name }} </h4>
        </div>
        <div class="slideshow-content graph">
        </div>
        <div class="slideshow-content text">
            <ul>
                <li>
                    The video the student has viewed the most on average is
                    <entity-link :id="most_attempts[0].id" :context="context"></entity-link>
                    , which viewed {{ Number(most_attempts[0].attempts).toFixed(1) }} times.
                </li>
                <li>
                    The video the student has viewed the least is
                    <entity-link :id="least_attempts[0].id" :context="context"></entity-link>
                    , which viewed {{ Number(least_attempts[0].attempts).toFixed(1) }} times.
                </li>
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
            most_attempts() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, attempts: d.attempts }))
                    .sort((a, b) => b.attempts - a.attempts)
                    .slice(0, 3);
            },
            least_attempts() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, attempts: d.attempts }))
                    .sort((a, b) => a.attempts - b.attempts)
                    .slice(0, 3);
            },
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
                if (!video_activies) return null;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
                xAxis.formatter(d => video_activies[d].name);

                var watchTimeScale = new Plottable.Scales.Linear();
                var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
                watchTimeAxis.formatter((d) => Number(d / 60).toFixed(1))
                var watchTimePlot = new Plottable.Plots.Bar()
                    .y(d => d.video_watch_time, watchTimeScale)
                    .x((d, i) => i, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[6])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies));


                var attemptScale = new Plottable.Scales.Linear();
                var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
                var attemptPlot = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptScale)
                    .x((d, i) => i, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[7])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies));

                var attemptAxisLable = new Plottable.Components.AxisLabel("times", "0");
                var attemptPlotLable = new Plottable.Components.AxisLabel("video view times", "0");

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

                var table = new Plottable.Components.Table([
                    [attemptAxisLable, attemptPlotLable],
                    [attemptAxis, attemptPlot],
                    [watchTimeLabel, watchTimePlotLabel],
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
.slideshow-content.graph {
    height: 40vh;
}

.slideshow-content.text h6 {
    font-weight: 600;
    padding-top: 1vh;
    padding-bottom: 0.5vh;
}
</style>