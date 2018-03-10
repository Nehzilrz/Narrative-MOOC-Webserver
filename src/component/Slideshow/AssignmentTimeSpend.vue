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
                        The assignment with highest working time on average is
                        <entity-link :id="most_work[0].id" :context="context"></entity-link>
                        , which has been spent {{ Number(most_work[0].work_time / 60).toFixed(1) }} minutes.
                    </li>
                    <li>
                        The assignment with lowest working time on average is
                        <entity-link :id="least_work[0].id" :context="context"></entity-link>
                        , which has been spent {{ Number(least_work[0].work_time / 60).toFixed(1) }} minutes.
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
            most_work() {
                return this.item.data.problem_activies.slice(0)
                    .sort((a, b) => b.work_time - a.work_time)
                    .slice(0, 3);
            },
            least_work() {
                return this.item.data.problem_activies.slice(0)
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
                var watchTimePlot = new Plottable.Plots.Bar()
                    .y(d => d.work_time, watchTimeScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[5])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(assignment_activies));

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var watchTimePlotLabel = new Plottable.Components.AxisLabel("time", "0");

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