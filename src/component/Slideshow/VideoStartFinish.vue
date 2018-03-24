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
                    The video the student started watching at the latest was 
                    <entity-link :id="max_video_delay.id" :context="context" :parent="item"></entity-link>
                    , and they started watching it {{ Number(max_video_delay.delay).toFixed(1) }} days after the video was released.
                </styled-text>    
            </div>
            <div class="slideshow-content mooc-content text">    
                <styled-text :context="context">
                    The longest video for the student viewing cycle is <entity-link :id="max_video_duration.id" :context="context" :parent="item"></entity-link>.
                        They watched for {{ Number(max_video_duration.duration).toFixed(1) }} days.
                </styled-text>
            </div>
            <video-list :item="item" :context="context"></video-list>
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
            video_start_finish() {
                const video_activies = this.item.data.video_activies;
                if (!video_activies) return [];
                const context = this.context;
                return video_activies.map(d => {
                    d.duration = (d.modified - d.created) / 86400000;
                    d.delay = (d.created - (context.id2item[d.id] && context.id2item[d.id].chapter_start)) / 86400000;
                    return {
                        duration: d.duration,
                        delay: d.delay,
                        name: d.name,
                        id: d.id,
                        type: 'video',
                    }
                });
            },
            max_video_duration() {
                if (this.video_start_finish.length == 0) return null;
                const val = Math.max(...this.video_start_finish.map(d => d.duration));
                return this.video_start_finish.find(d => d.duration == val);
            },
            max_video_delay() {
                if (this.video_start_finish.length == 0) return null;
                const val = Math.max(...this.video_start_finish.map(d => d.delay));
                return this.video_start_finish.find(d => d.delay == val);
            }
        },
        methods: {
            render(data, context) {
                const video_activies = this.video_start_finish;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['delay', 'duration']);
                colorScale.range([context.color_schema[1], context.color_schema[0]]);

                var timeScale = new Plottable.Scales.Linear();
                var timeAxis = new Plottable.Axes.Numeric(timeScale, "left").xAlignment("left");
                timeAxis.formatter((d) => `${Number(d).toFixed(1)}`)
                var plots = new Plottable.Plots.StackedBar()
                    .y((d, i, dataset) => 
                        dataset.metadata() == 'delay' ?
                        d.delay : d.duration, timeScale
                    )
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('delay'))
                    .addDataset(new Plottable.Dataset(video_activies).metadata('duration'));

                var timeLabel = new Plottable.Components.AxisLabel("Days", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("days", "0");
                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(2);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

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
                    this.tooltip_message = `Delay: ${Number(x.delay).toFixed(1)} days, Duration: ${Number(x.duration).toFixed(1)} days`;
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
                    [timeLabel, legend],
                    [timeAxis, plots],
                    [null, xAxis]
                ]);
                return table;
            },
        },
        props: ["item", "context"],
    };
</script>

<style scope>
</style>