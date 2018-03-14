<template>
    <div class="slideshow-page">
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content graph" style="height: 40vh">
            </div>
            <div class="slideshow-content text">
                <h6> 
                    Activies in this week:
                </h6>
                <ul>
                    <li v-if="max_video_activies">
                        The most visited video was 
                        <b-link href="javascript:void(0);" @click="context.selectVideo(max_video_activies.id)">
                            <span class="step" :style="{background: context.video_color}">
                                V
                            </span>            
                            {{ max_video_activies.name }}
                        </b-link>
                        , {{ max_video_activies.activeness }} 
                        students visited the video.
                    </li>
                    <li v-if="min_video_activies">
                        The least visited video was 
                        <b-link href="javascript:void(0);" @click="context.selectVideo(min_video_activies.id)">
                            <span class="step" :style="{background: context.video_color}">
                                V
                            </span>            
                            {{ min_video_activies.name }}
                        </b-link>
                        , {{ min_video_activies.activeness }} 
                        students visited the video.
                    </li>
                </ul>
            </div>
            <div class="slideshow-content text" v-if="item.follow_ups.length > 0">
                <h6>
                    Related questions:
                </h6>
                <ul>
                    <li v-for="q in context.followupSlides(item)">
                        <b-link href="javascript:void(0);" @click="context.moveto(q)">
                            {{ q.name }}
                        </b-link>
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
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color]);

                var activenessScale = new Plottable.Scales.Linear();
                var activenessAxis = new Plottable.Axes.Numeric(activenessScale, "left").xAlignment("left");
                var activenessPlot = new Plottable.Plots.Bar()
                    .y(d => d.activeness, activenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'))
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(1);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");        
                        
                var yLabel = new Plottable.Components.AxisLabel("Popularity", "0");

                var table = new Plottable.Components.Table([
                    [yLabel, legend],
                    [activenessAxis, activenessPlot],
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
    padding-top: 1vh;
    padding-bottom: 0.5vh;
}
</style>