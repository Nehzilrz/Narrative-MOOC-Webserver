<template>
    <div class="slideshow-content container">
        <div class="slideshow-content title">
            <h4 style="font-weight: 800"> {{ item.name }} </h4>
        </div>
        <div class="slideshow-content graph" style="height: 40vh">
        </div>
        <div class="slideshow-content text">
            <h6 style="font-weight: 600; padding-top: 1vh; padding-bottom: 0.5vh;"> 
                Activies in this week:
            </h6>
            <ul>
                <li>
                    The most visited video was 
                    <b-link href="javascript:void(0);" @click="onSelectVideo(item.data.max_video_activies.id)">
                        <span class="step" :style="{background: context.colorSchema[1]}">
                            V
                        </span>            
                        {{ item.data.max_video_activies.name }}
                    </b-link>
                    , {{ item.data.max_video_activies.activeness }} 
                    students visited the video.
                </li>
                <li>
                    The least visited video was 
                    <b-link href="javascript:void(0);" @click="onSelectVideo(item.data.min_video_activies.id)">
                        <span class="step" :style="{background: context.colorSchema[1]}">
                            V
                        </span>            
                        {{ item.data.min_video_activies.name }}
                    </b-link>
                    , {{ item.data.min_video_activies.activeness }} 
                    students visited the video.
                </li>
                <li style="margin-top: 1.5vh">
                    The most visited assignment was 
                    <b-link href="javascript:void(0);" @click="onSelectAssignment(item.data.max_video_activies.id)">
                        <span class="step" :style="{background: context.colorSchema[3]}">
                            A
                        </span>            
                        {{ item.data.max_assignment_activies.name }}
                    </b-link>
                    , {{ item.data.max_assignment_activies.activeness }} 
                    students visited the assignment.
                </li>
                <li>
                    The least visited assignment was 
                    <b-link href="javascript:void(0);" @click="onSelectAssignment(item.data.min_video_activies.id)">
                        <span class="step" :style="{background: context.colorSchema[3]}">
                            A
                        </span>            
                        {{ item.data.min_assignment_activies.name }}
                    </b-link>
                    , {{ item.data.min_assignment_activies.activeness }} 
                    students visited the assignment.
                </li>
            </ul>
        </div>
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
            this.$sr.reveal(".slideshow-content", {
                duration: 500,
                viewFactor: 0.4,
                rotate: { x: 65 },
            });
            this.$forceUpdate();
        },
        methods: {
            render(data, context) {
                const video_activies = data.video_activies;
                if (!video_activies) return null;
                const problem_activies = data.problem_activies;
                if (!problem_activies) return null;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video', 'assignment']);
                data.video_color = context.colorSchema[1];
                data.assignment_color = context.colorSchema[3];
                colorScale.range([data.video_color, data.assignment_color]);

                const max_video_activies = Math.max(...video_activies.map(d => d.activeness));
                const min_video_activies = Math.min(...video_activies.map(d => d.activeness));
                const max_assignment_activies = Math.max(...problem_activies.map(d => d.activeness));
                const min_assignment_activies = Math.min(...problem_activies.map(d => d.activeness));
                data.max_video_activies = video_activies.find(d => d.activeness == max_video_activies);
                data.min_video_activies = video_activies.find(d => d.activeness == min_video_activies);
                data.max_assignment_activies = problem_activies.find(d => d.activeness == max_assignment_activies);
                data.min_assignment_activies = problem_activies.find(d => d.activeness == min_assignment_activies);

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
                        
                var yLabel = new Plottable.Components.AxisLabel("Activeness", "0");

                var table = new Plottable.Components.Table([
                    [yLabel, legend],
                    [activenessAxis, activenessPlot],
                    [null, xAxis]
                ]);

                return table;
            },
            onSelectVideo() {

            },
        },
        props: ["item", "context"],
    };
</script>

<style scope>
.slideshow-content.graph {
    perspective: 200px;
    background-attachment: fixed;
    padding-top: 1vh;
    padding-bottom: 1vh;
}

.slideshow-content.text {
    padding-top: 1vh;
    padding-bottom: 1vh;
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    color: #222;
}
</style>