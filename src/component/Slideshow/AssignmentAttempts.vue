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
                show_tooltip: false,
                tooltip_message: 'Hello World',
                current_point: {},
                table: null,
                lastElement: null,
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
                
                var interaction = new Plottable.Interactions.Click();
                interaction.onClick(point => {
                    if (this.context.enable_highlight_chart) {
                        var element = plots.entitiesAt(point)[0];
                        if (!element) return;
                        if (this.lastElement == element.datum.id) {
                            plots.selections().attr("opacity", 1);
                            this.lastElement = null;
                            return;
                        } else {
                            plots.selections().attr("opacity", 0.5);
                        }
                        var selection = element.selection;
                        selection.attr("opacity", 1);
                        this.lastElement = element.datum.id;
                    } else {
                        var element = plots.entitiesAt(point)[0];
                        if (!element) return;
                        var selection = element.selection;
                        if (!selection) return;
                        var x = selection.datum();
                        x = context.id2item[x.id];
                        if (x.type == 'video') {
                            context.selectVideo(x, this.item);
                        } else if (x.type == 'assignment') {
                            context.selectAssignment(x, this.item);
                        }
                    }
                });
                interaction.attachTo(plots);
                var interaction2 = new Plottable.Interactions.Pointer();
                interaction2.onPointerMove(point => {
                    var element = plots.entitiesAt(point)[0];
                    if (!element) {
                        this.show_tooltip = false;
                        return;
                    }
                    var selection = element.selection;
                    if (!selection) return;
                    this.show_tooltip = true;
                    this.current_point.x = point.x + plots.origin().x;
                    this.current_point.y = point.y + plots.origin().y;
                    var x = selection.datum();
                    this.tooltip_message = `value: ${x.attempts}`;
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                        selection.attr("opacity", 1);
                    }
                }).onPointerExit(point => {
                    this.show_tooltip = false;
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                    }
                });
                interaction2.attachTo(plots);


                var attemptsLabel = new Plottable.Components.AxisLabel("attempts", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("attempts", "0");

                var table = new Plottable.Components.Table([
                    [attemptsLabel, null],
                    [attemptsAxis, plots],
                    [null, xAxis]
                ]);
                return table;
            },
        },
        props: ["item", "context", "step"],
    };
</script>

<style scope>
.slideshow-content.text h6 {
    font-weight: 600;
}
</style>