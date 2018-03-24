<template>
    <div class="nm-block">
        <div class="graph nm-block b2w b4h" ref="chart">
        </div>
        <div class="text nm-block b2w b4h">
            <div class="nm-block">
                <styled-text :context="context">
                    The assignment with highest attempts on average is
                    <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                    with the attempts of {{ Number(max_assignment[0].attempts).toFixed(1) }}.
                </styled-text>
            </div>
            <div class="nm-block">
                <styled-text :context="context">
                    The assignment with lowest attempts on average is
                    <entity-link :id="min_assignment[0].id" :context="context" :parent="item"></entity-link>
                    with the attempts of {{ Number(min_assignment[0].attempts).toFixed(1) }}.
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
            this.tables.push(this.render(this.item.data, this.context));
        },
        computed: {
            max_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, attempts: d.attempts }))
                    .sort((a, b) => b.attempts - a.attempts)
                    .slice(0, 3);
            },
            min_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, attempts: d.attempts }))
                    .sort((a, b) => a.attempts - b.attempts)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var attemptsScale = new Plottable.Scales.Linear();
                var attemptsAxis = new Plottable.Axes.Numeric(attemptsScale, "left").xAlignment("left");
                attemptsAxis.formatter((d) => `${Number(d).toFixed(1)}`)
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptsScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[3])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies));

                if (this.lastElement) {
                    plots.attr("opacity", d => d.id == this.lastElement ? 1 : 0.5);
                }
                
                var attemptsLabel = new Plottable.Components.AxisLabel("attempts", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("attempts", "0");

                this.plots = plots;
                this.attachClick(plots);
                this.attachMousemove(plots, d => `value: ${Number(d.attempts).toFixed(2)}`);

                var table = new Plottable.Components.Table([
                    [attemptsLabel, null],
                    [attemptsAxis, plots],
                    [null, xAxis],
                ]);
                return table;
            },
        },
    };
</script>

<style scope>
</style>