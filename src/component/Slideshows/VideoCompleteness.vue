<template>
<div>
    <div class="b4w b4h nm-block graph">
    </div>
    <div class="b4w bh nm-block text">
        <styled-text :context="context">
            The video with highest completeness on average is
            <entity-link :id="max_video[0].id" :context="context" :parent="item"></entity-link>
            , {{ Number(max_video[0].completeness * 100).toFixed(1) }}% students completed this video.
        </styled-text>
    </div>
    <div class="b4w bh nm-block text">
        <styled-text :context="context">
            The video with lowest completeness on average is
            <entity-link :id="min_video[0].id" :context="context" :parent="item"></entity-link>
            , {{ Number(min_video[0].completeness * 100).toFixed(1) }}% students completed this video.
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
            this.tables.push(this.render(this.item.data, this.context));
        },
        computed: {
            max_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, completeness: d.completeness }))
                    .sort((a, b) => b.completeness - a.completeness)
                    .slice(0, 3);
            },
            min_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, completeness: d.completeness }))
                    .sort((a, b) => a.completeness - b.completeness)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var completenessScale = new Plottable.Scales.Linear();
                var completenessAxis = new Plottable.Axes.Numeric(completenessScale, "left").xAlignment("left");
                completenessAxis.formatter((d) => `${Number(d * 100).toFixed(1)}%`)
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.completeness, completenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[0])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies));

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${Number(x.completeness * 100).toFixed(1)}%`);

                var completenessLabel = new Plottable.Components.AxisLabel("", "0");
                var completenessPlotLabel = new Plottable.Components.AxisLabel("completeness", "0");

                var table = new Plottable.Components.Table([
                    [completenessLabel, null],
                    [completenessAxis, plots],
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