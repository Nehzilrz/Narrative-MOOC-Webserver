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
                        Attempts in this week:
                    </h6>
                    <div style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment with highest attempts on average is
                            <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                            with the attempts of {{ Number(max_assignment[0].attempts).toFixed(1) }}.
                        </styled-text>
                        <styled-text :context="context">
                            The assignment with lowest attempts on average is
                            <entity-link :id="min_assignment[0].id" :context="context" :parent="item"></entity-link>
                            with the attempts of {{ Number(min_assignment[0].attempts).toFixed(1) }}.
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
            this.context.bus.$on("add-text-box", this.handle);
        },
        destroyed() {
            this.context.bus.$off("add-text-box", this.handle);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
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
            render(data, context) {
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var attemptsScale = new Plottable.Scales.Linear();
                var attemptsAxis = new Plottable.Axes.Numeric(attemptsScale, "left").xAlignment("left");
                attemptsAxis.formatter((d) => `${Number(d).toFixed(1)}`)
                var attemptsPlot = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptsScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[3])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies));

                var attemptsLabel = new Plottable.Components.AxisLabel("attempts", "0");
                var attemptsPlotLabel = new Plottable.Components.AxisLabel("attempts", "0");

                var table = new Plottable.Components.Table([
                    [attemptsLabel, null],
                    [attemptsAxis, attemptsPlot],
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