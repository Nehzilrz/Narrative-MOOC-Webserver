<template>
    <div class="slideshow-page">
        <div class="slideshow-content title">
            <h4> {{ item.name }} </h4>
        </div>
        <div class="slideshow-content graph" style="height: 40vh">
        </div>
        <div class="slideshow-content text">
            <h6> 
                Activies in this week:
            </h6>
            <ul>
                <li v-if="max_assignment_activies">
                    The most tried assignment was 
                    <entity-link :id="max_assignment_activies.id" :context="context"></entity-link>
                    , each students submitted this assignment {{ max_assignment_activies.attempts }} times.
                </li>
                <li v-if="min_assignment_activies">
                    The least tried assignment was 
                    <entity-link :id="min_assignment_activies.id" :context="context"></entity-link>
                    , each students submitted this assignment {{ min_assignment_activies.attempts }} times.
                </li>
            </ul>
        </div>
        <follow-up :item="item" :context="context"></follow-up>
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
            max_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.max(...problem_activies.map(d => d.attempts));
                return problem_activies.find(d => d.attempts == t);
            },
            min_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.min(...problem_activies.map(d => d.attempts));
                return problem_activies.find(d => d.attempts == t);
            },
        },
        methods: {
            render(data, context) {
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['assignment']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.assignment_color]);

                var attemptScale = new Plottable.Scales.Linear();
                var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
                var attemptPlot = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

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