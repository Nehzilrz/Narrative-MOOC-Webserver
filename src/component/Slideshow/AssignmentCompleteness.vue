<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content" style="height: 25vh">
                <div class="graph" style="width: 50%; float: left;">
                </div>
                <div class="text" style="width: 50%; float: left; padding-left: 2vw;
                    padding-top: 1vh;">
                    <h6> 
                        Time cost in this week:
                    </h6>
                    <div style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment with highest working time on average is
                            <entity-link :id="most_work[0].id" :context="context" :parent="item"></entity-link>
                            , which has been spent {{ Number(most_work[0].work_time / 60).toFixed(1) }} minutes.
                        </styled-text>
                        <styled-text :context="context">
                            The assignment with lowest working time on average is
                            <entity-link :id="least_work[0].id" :context="context" :parent="item"></entity-link>
                            , which has been spent {{ Number(least_work[0].work_time / 60).toFixed(1) }} minutes.
                        </styled-text>
                    </div>
                </div>
            </div>
            <div class="slideshow-content" style="height: 25vh">
                <div class="graph" style="float:left; width: 50%">
                </div>
                <div class="text" style="width: 50%; float: left; padding-left: 2vw;
                    padding-top: 1vh;">
                    <h6> 
                        Completeness in this week:
                    </h6>
                    <div style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment with highest completeness on average is
                            <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                            , {{ Number(max_assignment[0].completeness * 100).toFixed(1) }}% students completed this assignment.
                        </styled-text>

                        <styled-text :context="context">
                            The assignment with lowest completeness on average is
                            <entity-link :id="min_assignment[0].id" :context="context" :parent="item"></entity-link>
                            , {{ Number(min_assignment[0].completeness * 100).toFixed(1) }}% students completed this assignment.
                        </styled-text>
                    </div>
                </div>
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
                table1: null,
                table2: null,
            };
        },
        created() {
            this.table1 = this.render1(this.item.data, this.context);
            this.table2 = this.render2(this.item.data, this.context);
            this.context.bus.$on("add-text-box", this.handle);
        },
        destroyed() {
            this.context.bus.$off("add-text-box", this.handle);
        },
        mounted() {
            var elements = this.$el.getElementsByClassName('graph');
            this.table1.renderTo(elements[0]);
            this.table2.renderTo(elements[1]);
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
            handle(_id) {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            },
            render1(data, context) {
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
                    .attr("fill", context.assignment_color)
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
            render2(data, context) {
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var completenessScale = new Plottable.Scales.Linear();
                var completenessAxis = new Plottable.Axes.Numeric(completenessScale, "left").xAlignment("left");
                completenessAxis.formatter((d) => `${Number(d * 100).toFixed(1)}%`)
                var completenessPlot = new Plottable.Plots.Bar()
                    .y(d => d.completeness, completenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[2])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies));

                var completenessLabel = new Plottable.Components.AxisLabel("completeness", "0");
                var completenessPlotLabel = new Plottable.Components.AxisLabel("completeness", "0");

                var table = new Plottable.Components.Table([
                    [completenessLabel, null],
                    [completenessAxis, completenessPlot],
                    [null, xAxis]
                ]);
                return table;
            },
        },
        props: ["item", "context"],
    };
</script>

<style scope>
</style>