<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content mooc-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content mooc-content graph" style="height: 25vh">
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
            <div class="slideshow-content mooc-content text">
                <styled-text :context="context">
                    The video with highest completeness on average is
                    <entity-link :id="max_video[0].id" :context="context" :parent="item"></entity-link>
                    , {{ Number(max_video[0].completeness * 100).toFixed(1) }}% students completed this video.
                </styled-text>
            </div>
            <div class="slideshow-content mooc-content text">
                <styled-text :context="context">
                    The video with lowest completeness on average is
                    <entity-link :id="min_video[0].id" :context="context" :parent="item"></entity-link>
                    , {{ Number(min_video[0].completeness * 100).toFixed(1) }}% students completed this video.
                </styled-text>
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
            max_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, completeness: d.completeness }))
                    .sort((a, b) => b.completeness - a.completeness)
                    .slice(0, 3);
            },
            min_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, completeness: d.completeness }))
                    .sort((a, b) => a.completeness - b.completeness)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var completenessScale = new Plottable.Scales.Linear();
                var completenessAxis = new Plottable.Axes.Numeric(completenessScale, "left").xAlignment("left");
                completenessAxis.formatter((d) => `${Number(d * 100).toFixed(1)}%`)
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.completeness, completenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", context.color_schema[0])
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies));

                this.plots = plots;
                var interaction = new Plottable.Interactions.Click();
                interaction.onClick(point => {
                    if (this.context.enable_highlight_chart) {
                        var element = plots.entitiesAt(point)[0];
                        if (!element) {
                            this.last_element = null;
                        } else {
                            this.last_element = element.datum.id;
                        }
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
                    this.tooltip_message = `value: ${Number(x.completeness * 100).toFixed(1)}%`;
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


                var completenessLabel = new Plottable.Components.AxisLabel("", "0");
                var completenessPlotLabel = new Plottable.Components.AxisLabel("completeness", "0");

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
.slideshow-content.text h6 {
    font-weight: 600;
}
</style>