<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
        <div class="slide nm-block title">
            <h4> {{ item.name }} </h4>
        </div>
        <div class="slide nm-block graph" style="height: 25vh">
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
        <div class="slide nm-block text">
            <styled-text :context="context">
                The most tried video was 
                <entity-link :id="max_video_activies.id" :context="context" :parent="item"></entity-link>
                , each students visited the video {{ Number(max_video_activies.attempts).toFixed(1) }} times.
            </styled-text>
        </div>
        <div class="slide nm-block text">
            <styled-text :context="context">
                The least tried video was 
                <entity-link :id="min_video_activies.id" :context="context" :parent="item"></entity-link>
                , each students visited the video {{ Number(min_video_activies.attempts).toFixed(1) }} times.
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
            max_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.max(...video_activies.map(d => d.attempts));
                return video_activies.find(d => d.attempts == t);
            },
            min_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.min(...video_activies.map(d => d.attempts));
                return video_activies.find(d => d.attempts == t);
            },
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color]);

                var attemptScale = new Plottable.Scales.Linear();
                var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.attempts, attemptScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'));

                var attemptAxisLable = new Plottable.Components.AxisLabel("Frequency", "0");
                var plotsLable = new Plottable.Components.AxisLabel("", "0");

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
                        x = context.item_mapping[x.id];
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
                    this.tooltip_message = `value: ${x.attempts}`;
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

                var table = new Plottable.Components.Table([
                    [attemptAxisLable, null],
                    [attemptAxis, plots],
                    [null, xAxis]
                ]);
                return table;
            },
        },
        props: ["item", "context"],
    };
</script>

<style scope>
.slide.text h6 {
    font-weight: 600;
}
</style>