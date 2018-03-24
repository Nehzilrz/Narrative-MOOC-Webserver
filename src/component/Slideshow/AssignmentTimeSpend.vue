<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content mooc-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content mooc-content" style="height: 25vh">
                <div class="graph mooc-content" style="width: 50%; float: left;">
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
                            The assignment with highest working time on average is
                            <entity-link :id="most_work[0].id" :context="context" :parent="item"></entity-link>
                            , which has been spent {{ Number(most_work[0].work_time / 60).toFixed(1) }} minutes.
                        </styled-text>
                    </div>
                    <div class="mooc-content" style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment with lowest working time on average is
                            <entity-link :id="least_work[0].id" :context="context" :parent="item"></entity-link>
                            , which has been spent {{ Number(least_work[0].work_time / 60).toFixed(1) }} minutes.
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
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.work_time, watchTimeScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.assignment_color)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(assignment_activies));
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
                    this.tooltip_message = `value: ${x.activeness}`;
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


                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var PlotsLabel = new Plottable.Components.AxisLabel("time", "0");

                var table = new Plottable.Components.Table([
                    [watchTimeLabel, null],
                    [watchTimeAxis, plots],
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