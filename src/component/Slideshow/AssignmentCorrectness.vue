<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content" style="height: 25vh">
                <div class="graph" style="float: left; width: 50%;">
                </div>
                <div class="text" style="width: 50%; float: left; padding-left: 2vw;
                    padding-top: 1vh;">
                    <h6> 
                        Correctness in this week:
                    </h6>
                    <div style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment with highest correctness on average is
                            <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                            with the correctness of {{ Number(max_assignment[0].correctness * 100).toFixed(1) }}%.
                        </styled-text>
                        <styled-text :context="context">
                            The assignment with lowest correctness on average is
                            <entity-link :id="min_assignment[0].id" :context="context" :parent="item"></entity-link>
                            with the correctness of {{ Number(min_assignment[0].correctness * 100).toFixed(1) }}%.
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
                table: null,
            };
        },
        created() {
            this.table = this.render(this.item.data, this.context);
            this.context.bus.$on("add-text-box", (_id) => {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            });
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
        },
        computed: {
            max_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, correctness: d.correctness }))
                    .sort((a, b) => b.correctness - a.correctness)
                    .slice(0, 3);
            },
            min_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, correctness: d.correctness }))
                    .sort((a, b) => a.correctness - b.correctness)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var correctnessScale = new Plottable.Scales.Linear();
                var correctnessAxis = new Plottable.Axes.Numeric(correctnessScale, "left").xAlignment("left");
                correctnessAxis.formatter((d) => `${Number(d * 100).toFixed(1)}%`)
                var correctnessPlot = new Plottable.Plots.Bar()
                    .y(d => d.correctness, correctnessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[2])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies));

                var correctnessLabel = new Plottable.Components.AxisLabel("Correctness", "0");
                var correctnessPlotLabel = new Plottable.Components.AxisLabel("correctness", "0");

                var table = new Plottable.Components.Table([
                    [correctnessLabel, null],
                    [correctnessAxis, correctnessPlot],
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