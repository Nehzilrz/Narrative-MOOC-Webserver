<template>
    <div class="slideshow-page">
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content graph" style="height: 25vh">
            </div>
            <div class="slideshow-content text">
                <h6>
                    Summary in video watching of this week:
                </h6>
                <ul>
                    <li>
                        The video the student started watching at the latest was 
                        <entity-link :id="max_video_delay.id" :context="context" :parent="item"></entity-link>
                        , and they started watching it {{ Number(max_video_delay.delay).toFixed(1) }} days after the video was released.
                    </li>
                    <li>
                        The longest video for the student viewing cycle is <entity-link :id="max_video_duration.id" :context="context" :parent="item"></entity-link>.
                         They watched for {{ Number(max_video_duration.duration).toFixed(1) }} days.
                    </li>
                </ul>
            </div>
            <video-list :item="item" :context="context"></video-list>
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
                var timePlot = new Plottable.Plots.StackedBar()
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
                var timePlotLabel = new Plottable.Components.AxisLabel("days", "0");
                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(2);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

                var table = new Plottable.Components.Table([
                    [timeLabel, legend],
                    [timeAxis, timePlot],
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