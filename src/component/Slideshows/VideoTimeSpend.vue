<template>
<div>
    <div class="b4w b5h nm-block graph">
    </div>
    <div class="b4w bh nm-block text">
        <styled-text :context="context">
            The video with highest watch time on average is
            <entity-link :id="most_watch[0].id" :parent="item"></entity-link>
            , which has been watched {{ Number(most_watch[0].watch_time).toFixed(1) }} minutes.
        </styled-text>
    </div>
    <div class="b4w bh nm-block text">
        <styled-text :context="context">
            The video with lowest watch time on average is
            <entity-link :id="least_watch[0].id" :parent="item"></entity-link>
            , which has been watched {{ Number(least_watch[0].watch_time).toFixed(1) }} minutes.
        </styled-text>
    </div>
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
            this.tables.push(this.render(this.data, this.context));
        },
        computed: {
            most_watch() {
                return this.data.video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
                    .sort((a, b) => b.watch_time - a.watch_time)
                    .slice(0, 3);
            },
            least_watch() {
                return this.data.video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
                    .sort((a, b) => a.watch_time - b.watch_time)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['watch time', 'video length']);
                colorScale.range([context.color_schema[1], context.color_schema[0]]);

                var watchTimeScale = new Plottable.Scales.Linear();
                var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
                watchTimeAxis.formatter((d) => Number(d / 60).toFixed(1))
                var plots = new Plottable.Plots.ClusteredBar()
                    .y((d, i, dataset) => 
                        dataset.metadata() == 'watch time' ?
                        d.video_watch_time : this.$mapping[d.id].duration, watchTimeScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('watch time'))
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video length'));

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");
                
                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(1);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${x.video_watch_time}`);
                var plotGroup = new Plottable.Components.Group([plots, legend]);

                var table = new Plottable.Components.Table([
                    [watchTimeLabel, null],
                    [watchTimeAxis, plotGroup],
                    [null, xAxis]
                ]);
                return table;
            },
        },
    };
</script>

<style scope>
</style>