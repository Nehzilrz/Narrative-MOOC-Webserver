<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content mooc-content title">
                <h3> {{ item.name }} </h3>
            </div>
            <div class="slideshow-content mooc-content graph" style="height: 40vh;">
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
                    The most visited video was 
                    <entity-link :id="max_video_activies.id" :context="context" :parent="item"></entity-link>
                    , {{ max_video_activies.activeness }} 
                    students visited the video.
                </styled-text>
            </div>
            <div class="slideshow-content mooc-content text">
                <styled-text :context="context">
                The least visited video was 
                <entity-link :id="min_video_activies.id" :context="context" :parent="item"></entity-link>
                , {{ min_video_activies.activeness }} 
                students visited the video.
                </styled-text>
            </div>
            <div class="slideshow-content mooc-content text">
                <styled-text :context="context">
                The most visited assignment was 
                <entity-link :id="max_assignment_activies.id" :context="context" :parent="item"></entity-link>
                , {{ max_assignment_activies.activeness }} 
                students visited the assignment.
                </styled-text>
            </div>
            <div class="slideshow-content mooc-content text">
                <styled-text :context="context">
                The least visited assignment was 
                <entity-link :id="min_assignment_activies.id" :context="context" :parent="item"></entity-link>
                , {{ min_assignment_activies.activeness }} 
                students visited the assignment.
                </styled-text>
            </div>
            <follow-up :item="item" :context="context"></follow-up>
        </template>
    </div>
</template>

<script>
    import SlideshowBase from "./SlideshowBase.vue";
    import Plottable from "plottable";

    export default {
        data() {
            return {
            };
        },
        extends: SlideshowBase,
        watch: {
            last_element(val) {
                this.item.cache.last_element = val;
                this.plots && this.plots.attr("opacity", d => d.id == this.last_element ? 1 : 0.5);
            },
        },
        created() {
            this.last_element = this.item.cache.last_element;
            this.table = this.render(this.item.data, this.context);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
        },
        computed: {
            max_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.max(...video_activies.map(d => d.activeness));
                return video_activies.find(d => d.activeness == t);
            },
            min_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.min(...video_activies.map(d => d.activeness));
                return video_activies.find(d => d.activeness == t);
            },
            max_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.max(...problem_activies.map(d => d.activeness));
                return problem_activies.find(d => d.activeness == t);
            },
            min_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.min(...problem_activies.map(d => d.activeness));
                return problem_activies.find(d => d.activeness == t);
            },
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video', 'assignment']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color, data.assignment_color]);

                var activenessScale = new Plottable.Scales.Linear();
                var activenessAxis = new Plottable.Axes.Numeric(activenessScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.activeness, activenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .attr("opacity", 0.8)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'))
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

                this.plots = plots;
                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(1);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

                if (this.last_element) {
                    plots.attr("opacity", d => d.id == this.last_element ? 1 : 0.5);
                }

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

                var yLabel = new Plottable.Components.AxisLabel("Popularity", "0");

                var table = new Plottable.Components.Table([
                    [yLabel, legend],
                    [activenessAxis, plots],
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