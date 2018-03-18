<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content graph" style="height: 30vh">
            </div>
            <div class="slideshow-content text">
                <ul>
                    <li>
                    <styled-text :context="context">
                        The video with highest watch time on average is
                        <entity-link :id="most_watch[0].id" :context="context" :parent="item"></entity-link>
                        , which has been watched {{ Number(most_watch[0].watch_time).toFixed(1) }} minutes.
                    </styled-text>
                    </li>
                    <li>
                    <styled-text :context="context">
                        The video with lowest watch time on average is
                        <entity-link :id="least_watch[0].id" :context="context" :parent="item"></entity-link>
                        , which has been watched {{ Number(least_watch[0].watch_time).toFixed(1) }} minutes.
                    </styled-text>
                    </li>
                </ul>
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
            this.context.bus.$on("add-text-box", (_id) => {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            });
            this.table = this.render(this.item.data, this.context);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
        },
        computed: {
            most_watch() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
                    .sort((a, b) => b.watch_time - a.watch_time)
                    .slice(0, 3);
            },
            least_watch() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
                    .sort((a, b) => a.watch_time - b.watch_time)
                    .slice(0, 3);
            }
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['watch time', 'video length']);
                colorScale.range([context.color_schema[1], context.color_schema[0]]);

                var watchTimeScale = new Plottable.Scales.Linear();
                var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
                watchTimeAxis.formatter((d) => Number(d / 60).toFixed(1))
                var plots = new Plottable.Plots.ClusteredBar()
                    .y((d, i, dataset) => 
                        dataset.metadata() == 'watch time' ?
                        d.video_watch_time : context.id2item[d.id].duration, watchTimeScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('watch time'))
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video length'));

                var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
                var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");
                
                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(1);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");
                        
                var interaction = new Plottable.Interactions.Click();
                var lastElement = null;
                interaction.onClick(point => {
                    if (this.context.enable_highlight_chart) {
                        var element = plots.entitiesAt(point)[0];
                        if (!element) return;
                        if (lastElement && lastElement.datum == element.datum) {
                            plots.selections().attr("opacity", 1);
                            lastElement = null;
                            return;
                        } else {
                            plots.selections().attr("opacity", 0.5);
                        }
                        var selection = element.selection;
                        selection.attr("opacity", 1);
                        lastElement = element;
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
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                        var element = plots.entitiesAt(point)[0];
                        if (!element) return;
                        var selection = element.selection;
                        if (!selection) return;
                        selection.attr("opacity", 1);
                        var x = selection.datum();
                    }
                }).onPointerExit(point => {
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 1);
                    }
                });
                interaction2.attachTo(plots);
                
                var plotGroup = new Plottable.Components.Group([plots, legend]);

                var table = new Plottable.Components.Table([
                    [watchTimeLabel, null],
                    [watchTimeAxis, plotGroup],
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