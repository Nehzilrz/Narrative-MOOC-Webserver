<template>
<div>
    <div class="b2w b4h graph nm-block">
    </div>
    <div class="b2w bh text">
        <div class="nm-block">
            <styled-text :context="context">
                The assignment with highest working time on average is
                <entity-link :id="most_work[0].id" :parent="item"></entity-link>
                , which has been spent {{ Number(most_work[0].work_time / 60).toFixed(1) }} minutes.
            </styled-text>
        </div>
        <div class="nm-block">
            <styled-text :context="context">
                The assignment with lowest working time on average is
                <entity-link :id="least_work[0].id" :parent="item"></entity-link>
                , which has been spent {{ Number(least_work[0].work_time / 60).toFixed(1) }} minutes.
            </styled-text>
        </div>
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
            most_work() {
                return this.data.problem_activies.slice(0)
                    .sort((a, b) => b.work_time - a.work_time)
                    .slice(0, 3);
            },
            least_work() {
                return this.data.problem_activies.slice(0)
                    .sort((a, b) => a.work_time - b.work_time)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const assignment_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var watchTimeScale = new Plottable.Scales.Linear();
                var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
                watchTimeAxis.formatter((d) => Number(d / 60).toFixed(1))
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.work_time, watchTimeScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.assignment_color)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(assignment_activies));
                if (this.lastElement) {
                    plots.attr("opacity", d => d.id == this.lastElement ? 1 : 0.5);
                }

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${x.activeness}`);

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var PlotsLabel = new Plottable.Components.AxisLabel("time", "0");

                var table = new Plottable.Components.Table([
                    [watchTimeLabel, null],
                    [watchTimeAxis, plots],
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