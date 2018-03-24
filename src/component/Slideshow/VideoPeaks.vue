
<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <div class="slideshow-content mooc-content title">
            <h4> {{ item.name }} </h4>
        </div>
        <div class="slideshow-content mooc-content graph" style="height: 30vh">
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
            <h6 style="font-weight: 600; padding-top: 1vh; padding-bottom: 0.5vh;"> 
                Peaks in this video:
            </h6>
        </div>
        <div class="slideshow-content mooc-content text">
            <ul style="padding-left: 2vw"
                v-if="item.data.video_peaks && item.data.video_peaks.length">
                <li class="mooc-content" v-for="peak, i in showed_peaks">
                    <styled-text :context="context">
                        The 
                        <b-link href="javascript:void(0);" @click="onVideoPeakChangeTime(peak)">
                            Peak 
                            <span class="step" :style="{ background: context.color_schema[i] }">
                                {{i}}
                            </span>
                        </b-link>
                        of students' operation appears at the 
                        <b-link href="javascript:void(0);" @click="onVideoPeakChangeTime(peak)">
                            {{ ~~(peak.time / 60) }}:{{ ~~(peak.time % 60 / 10) }}{{ peak.time % 10 }} 
                        </b-link>
                        of the video, with 
                        <b-link href="javascript:void(0);" @click="onSelectStudents(item.data.video_peaks[i].users, ' in Peak#' + i)">
                            {{ peak.student_num }} students
                        </b-link>
                        , 
                        which including {{ peak.operations.map(d => `${~~d.value} ${d.name.split('_').join(' ')} operations`).join(', ') }}.
                    </styled-text>
                </li>
                <li class="mooc-content" v-if="item.data.video_peaks.length > showed_peaks_num">
                    <b-link href="javascript:void(0);" @click="showed_peaks_num += 1">
                        Show more ...
                    </b-link>
                </li>
            </ul>
        </div>
        <div class="slideshow-content mooc-content text">
            <b-form-row v-show="show_video">
                <b-col cols="5">
                    <h6 style="font-weight: 600"> Screenshot of this peak: </h6>
                    <b-embed v-if="item.data.video"
                            type="video"
                            aspect="16by9"
                            :src= "item.data.video.html5_sources"
                            class="peak_embed_video"
                    ></b-embed>
                </b-col>
                <b-col cols="1">
                </b-col>
                <b-col cols="6">
                    <h6 style="font-weight: 600; padding-bottom: 2vh;"> A comparison of these students' in this peak with the average: </h6>
                    <div class="peak_embed_chart" 
                        style="width: 100%; height: 30vh; padding-left: 2vw;">
                    </div>
                </b-col>
            </b-form-row>
        </div>
        <follow-up :item="item" :context="context"></follow-up>
    </div>
</template>

<script>
    import Plottable from "plottable";
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
                show_video: false,
                showed_peaks_num: 3,
            };
        },
        extends: SlideshowBase,
        created() {
            this.table = this.render(this.item.data, this.context);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
            this.$forceUpdate();
        },
        computed: {
            showed_peaks() {
                const data = this.item.data;          
                return data.video_peaks.map((d, i) => {
                    const time = ~~((d.start + d.end) / 2);
                    return {
                        time: time,
                        student_num: d.activeness,
                        operations: data.video_logs.map(v => ({
                            name: v.type,
                            value: v.data[time] || 0,
                        })),
                        grade_distribution: d.grade_distribution,
                        index: i,
                    };
                }).slice(0, this.showed_peaks_num);
            }
        },
        methods: {
            render(data, context) {
                let video_logs = data.video_logs;
                let video_peaks = data.video_peaks;
                if (!video_logs || !video_peaks) return null;
                video_logs = data.video_logs.filter(d => d.type != 'play_video');
                let video = data.video;

                var xScale = new Plottable.Scales.Linear();
                var yScale = new Plottable.Scales.Linear();
                var scoreScale = new Plottable.Scales.Linear();
                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(video_logs.map(d => d.type));
                colorScale.range(["#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);
                scoreScale.domain([0, 100]);
                var areaPlot = new Plottable.Plots.StackedArea();
                var dColorScale = new Plottable.Scales.Color();
                dColorScale.range(this.context.color_schema);

                var duration = Math.max(...video_logs.map(d => d.data.length));
                for (const video_log of video_logs) {
                    areaPlot.addDataset(
                        new Plottable.Dataset(video_log.data).metadata(video_log.type)
                    );
                }

                xScale.domain([0, duration + 1]);

                var entropyScale = new Plottable.Scales.InterpolatedColor();
                entropyScale.range(["#dbdde0", "#33a02c"]);
                var entropyLegend = new Plottable.Components.InterpolatedColorLegend(
                    entropyScale
                ).xAlignment("right");
                entropyScale.domain([
                    Math.min(...video_peaks.map(d => d.entropy_delta)),
                    Math.max(...video_peaks.map(d => d.entropy_delta)),
                ]);

                var peakPlot = new Plottable.Plots.Bar()
                    .x(d => (d.start + d.end) / 2, xScale)
                    .y(d => 100, scoreScale)
                    .attr("width", d => 8 + d.end - d.start)
                    .attr("fill", d => d.entropy_delta, entropyScale)
                    .attr("opacity", 0.3)
                    .addDataset(new Plottable.Dataset(video_peaks));

                var peakCirclePlot = new Plottable.Plots.Scatter()
                    .x(d => (d.start + d.end) / 2, xScale)
                    .y(d => d.average_grade, scoreScale)
                    .attr("stroke-width", 1.5)
                    .attr("stroke", "lightgrey")
                    .size(10)
                    .attr("opacity", d => {
                        return 0.9;
                    })
                    .attr("fill", (d, i) => {
                        return i < this.context.color_schema.length ? this.context.color_schema[i] : 'white';
                    })
                    .addDataset(new Plottable.Dataset(video_peaks));

                var xAxis = new Plottable.Axes.Numeric(xScale, "bottom")
                    .yAlignment("bottom")
                    .formatter(d => "" + ~~(d / 60) + ":" + (d % 60 < 10 ? "0" : "") + d % 60);
                var yAxis = new Plottable.Axes.Numeric(yScale, "left");
                var scoreAxis = new Plottable.Axes.Numeric(scoreScale, "right").xAlignment(
                    "right"
                );

                areaPlot
                    .x((d, i) => i, xScale)
                    .y(d => d, yScale)
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale);

                var plotLegend = new Plottable.Components.Legend(colorScale);
                plotLegend.maxEntriesPerRow(4);
                plotLegend
                    .symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("center");

                var zScale = new Plottable.Scales.Linear();
                zScale.domain([0, 100]);
                zScale.tickGenerator(() => [video.average_grade]);
                var gridlines = new Plottable.Components.Gridlines(xScale, zScale);

                var zLabel = new Plottable.Axes.Numeric(zScale, "left").formatter(
                    () => "AVERAGE SCORE"
                );
                var plots = new Plottable.Components.Group([
                    areaPlot,
                    peakPlot,
                    peakCirclePlot,
                    zLabel,
                    gridlines
                ]);
                var yLabel = new Plottable.Components.AxisLabel("OPTS", "0");
                var scoreLabel = new Plottable.Components.AxisLabel("Score", "0");
                var legend = new Plottable.Components.Group([plotLegend, entropyLegend]);

                var scoreCategoryScale = new Plottable.Scales.Category();
                var scoreCategoryAxis = new Plottable.Axes.Category(
                    scoreCategoryScale,
                    "bottom"
                );
                scoreCategoryAxis.formatter(d => `${d * 10}-${(d + 1) * 10}`);


                var table = new Plottable.Components.Table([
                    [yLabel, legend, scoreLabel],
                    [yAxis, plots, scoreAxis],
                    [null, xAxis, null],
                    /*
                    [distributionAxis, distributionGroup, null],
                    [null, scoreCategoryAxis, null]
                    */
                ]);

                return table;
            },
            peak_render(peak) {
                var distributionScale = new Plottable.Scales.Linear();
                var distributionAxis = new Plottable.Axes.Numeric(distributionScale, "left");
                distributionAxis.formatter(d => ~~(d * 100) + "%");
                var distributionPlot = new Plottable.Plots.ClusteredBar();

                const video = this.item.data.video;
                const overall_sum = video.grade_distribution.reduce((a, b) => a + b, 0);
                distributionPlot.addDataset(
                    new Plottable.Dataset(
                        video.grade_distribution.map(d => d / overall_sum)
                    ).metadata('Average')
                );

                const current_sum = peak.grade_distribution.reduce((a, b) => a + b, 0);
                distributionPlot.addDataset(
                    new Plottable.Dataset(
                        peak.grade_distribution.map(d => d / current_sum)
                    ).metadata('Peak#' + peak.index)
                );

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['Average', 'Peak#' + peak.index]);
                colorScale.range(["lightgrey", this.context.color_schema[peak.index]]);

                var scoreCategoryScale = new Plottable.Scales.Category();
                var scoreCategoryAxis = new Plottable.Axes.Category(
                    scoreCategoryScale,
                    "bottom"
                );
                scoreCategoryAxis.formatter(d => `${d * 10}-${(d + 1) * 10}`);
                distributionPlot
                    .x((d, i) => i, scoreCategoryScale)
                    .y(d => d, distributionScale)
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .attr("opacity", (d, i, dataset) => 0.8)
                    .animated();

                var legend = new Plottable.Components.Legend(colorScale);
                legend.maxEntriesPerRow(4);
                legend
                    .symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("right");

                var plots = new Plottable.Components.Group([
                    distributionPlot, legend,
                ]);

                var table = new Plottable.Components.Table([
                    [distributionAxis, plots],
                    [null, scoreCategoryAxis]
                ]);

                return table;
            },
            onSelectVideo() {

            },
            onSelectStudents(users) {
                this.context.selectStudent({ users }, this.item);
            },
            onVideoPeakChangeTime(peak) {
                this.show_video = true;
                this.$el.getElementsByClassName('peak_embed_video')[0].currentTime = peak.time;
                const table = this.peak_render(peak);
                this.$nextTick(() => {
                    const element = this.$el.getElementsByClassName('peak_embed_chart')[0];
                    element.innerHTML = '';     
                    table.renderTo(element);
                });
            },
        },
    };
</script>

<style scope>
.slideshow-content.graph {
    perspective: 200px;
    background-attachment: fixed;
}

.slideshow-content.text {
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    color: #222;
}

span.step {
  border-radius: 0.65em;
  -moz-border-radius: 0.65em;
  -webkit-border-radius: 0.65em;
  color: #ffffff;
  display: inline-block;
  font-weight: bold;
  line-height: 1.3em;
  margin-right: 4px;
  text-align: center;
  width: 1.3em;
}
</style>