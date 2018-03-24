<template>
<div>
    <div class="slide nm-block" style="height: 25vh;">
        <div class="graph nm-block" ref="graph1" style="width: 50%; float: left;">
        </div>
        <div class="text" style="width: 50%; float: left; padding-left: 2vw;
            padding-top: 1vh;">
            <div class="nm-block" style="padding-left: 2vw;">
                <styled-text :context="context">
                    The assignment with highest working time on average is
                    <entity-link :id="most_work[0].id" :context="context" :parent="item"></entity-link>
                    , which has been spent {{ Number(most_work[0].work_time / 60).toFixed(1) }} minutes.
                </styled-text>
            </div>
            <div class="nm-block" style="padding-left: 2vw;">
                <styled-text :context="context">
                    The assignment with lowest working time on average is
                    <entity-link :id="least_work[0].id" :context="context" :parent="item"></entity-link>
                    , which has been spent {{ Number(least_work[0].work_time / 60).toFixed(1) }} minutes.
                </styled-text>
            </div>
        </div>
    </div>
    <div class="slide nm-block" style="height: 25vh;">
        <div class="graph nm-block" ref="graph2" style="float:left; width: 50%">
        </div>
        <div class="text" style="width: 50%; float: left; padding-left: 2vw;
            padding-top: 1vh;">
            <div class="nm-block" style="padding-left: 2vw;">
                <styled-text :context="context">
                    The assignment with highest completeness on average is
                    <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                    , {{ Number(max_assignment[0].completeness * 100).toFixed(1) }}% students completed this assignment.
                </styled-text>
            </div>
            <div class="nm-block" style="padding-left: 2vw;">
                <styled-text :context="context">
                    The assignment with lowest completeness on average is
                    <entity-link :id="min_assignment[0].id" :context="context" :parent="item"></entity-link>
                    , {{ Number(min_assignment[0].completeness * 100).toFixed(1) }}% students completed this assignment.
                </styled-text>
            </div>
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
            this.tables.push(this.render1(this.item.data, this.context));
            this.tables.push(this.render2(this.item.data, this.context));
        },
        computed: {
            max_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, completeness: d.completeness }))
                    .sort((a, b) => b.completeness - a.completeness)
                    .slice(0, 3);
            },
            min_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, completeness: d.completeness }))
                    .sort((a, b) => a.completeness - b.completeness)
                    .slice(0, 3);
            },
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
            render1(data, context) {
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

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("time", "0");
                this.plots.push(plots);
                this.attachMousemove(plots, x => `value: ${Number(x.work_time / 60).toFixed(1)} minutes`);
                this.attachClick(plots);

                var table = new Plottable.Components.Table([
                    [watchTimeLabel, null],
                    [watchTimeAxis, plots],
                    [null, xAxis]
                ]);
                return table;
            },
            
            render2(data, context) {
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var completenessScale = new Plottable.Scales.Linear();
                var completenessAxis = new Plottable.Axes.Numeric(completenessScale, "left").xAlignment("left");
                completenessAxis.formatter((d) => `${Number(d * 100).toFixed(1)}%`)
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.completeness, completenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[2])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies));
                
                this.plots.push(plots);
                this.attachMousemove(plots, x => `value: ${Number(x.completeness * 100).toFixed(1)}%`);
                this.attachClick(plots);

                var completenessLabel = new Plottable.Components.AxisLabel("completeness", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("completeness", "0");

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
</style>