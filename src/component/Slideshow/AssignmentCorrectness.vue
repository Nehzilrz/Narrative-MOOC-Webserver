<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content mooc-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content mooc-content" style="height: 25vh">
                <div class="graph mooc-content" style="float: left; width: 50%;">
                    <div class="p-2" :id="'tooltip' + $vnode.tag" style="opacity:0; position: absolute;"
                        :style="{
                            left: `${current_point && current_point.x}px`, 
                            top: `${current_point && (current_point.y - 5)}px` 
                        }">
                    </div>
                    <b-tooltip :show="show_tooltip" :target="'tooltip' + $vnode.tag">
                        {{ tooltip_message }}
                    </b-tooltip>
                </div>
                <div class="text" style="width: 50%; float: left; padding-left: 2vw;
                    padding-top: 1vh;">
                    <div class="mooc-content" style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment with highest correctness on average is
                            <entity-link :id="max_assignment[0].id" :context="context" :parent="item"></entity-link>
                            with the correctness of {{ Number(max_assignment[0].correctness * 100).toFixed(1) }}%.
                        </styled-text>
                    </div>
                    <div class="mooc-content" style="padding-left: 2vw;">
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
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
            };
        },
        extends: SlideshowBase,
        created() {
            this.table = this.render(this.item.data, this.context);
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
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.correctness, correctnessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[2])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(problem_activies));

                if (this.lastElement) {
                    plots.attr("opacity", d => d.id == this.lastElement ? 1 : 0.5);
                }
                this.plots = plots;
                
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
                        setTimeout(() => { this.show_tooltip = 0; }, 500);
                        return;
                    }
                    var selection = element.selection;
                    if (!selection) return;
                    this.show_tooltip = true;
                    this.current_point.x = point.x + plots.origin().x;
                    this.current_point.y = point.y + plots.origin().y;
                    var x = selection.datum();
                    this.tooltip_message = `value: ${Number(x.correctness * 100).toFixed(1)}%`;
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                        selection.attr("opacity", 1);
                    }
                }).onPointerExit(point => {
                    setTimeout(() => { this.show_tooltip = 0; }, 500);
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                    }
                });
                interaction2.attachTo(plots);


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

<style scope>
.slideshow-content.text h6 {
    font-weight: 600;
}
</style>