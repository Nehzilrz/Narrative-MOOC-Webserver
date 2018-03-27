<template>
<div>
    <div class="graph nm-block b2w b4h">
    </div>
    <div class="text nm-block b2w b4h">
        <div class="nm-block">
            <styled-text :context="context">
                The assignment with highest correctness on average is
                <entity-link :id="max_assignment[0].id" :parent="item"></entity-link>
                with the correctness of {{ Number(max_assignment[0].correctness * 100).toFixed(1) }}%.
            </styled-text>
        </div>
        <div class="nm-block">
            <styled-text :context="context">
                The assignment with lowest correctness on average is
                <entity-link :id="min_assignment[0].id" :parent="item"></entity-link>
                with the correctness of {{ Number(min_assignment[0].correctness * 100).toFixed(1) }}%.
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
            max_assignment() {
                return this.data.problem_activies.map(d => ({ name: d.name, id: d.id, correctness: d.correctness }))
                    .sort((a, b) => b.correctness - a.correctness)
                    .slice(0, 3);
            },
            min_assignment() {
                return this.data.problem_activies.map(d => ({ name: d.name, id: d.id, correctness: d.correctness }))
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
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.correctness, correctnessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[2])
                    
                    .addDataset(new Plottable.Dataset(problem_activies));

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${Number(x.correctness * 100).toFixed(1)}%`);

                var correctnessLabel = new Plottable.Components.AxisLabel("Correctness", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("correctness", "0");

                var table = new Plottable.Components.Table([
                    [correctnessLabel, null],
                    [correctnessAxis, plots],
                    [null, xAxis]
                ]);
                return table;
            },
        },
    };
</script>