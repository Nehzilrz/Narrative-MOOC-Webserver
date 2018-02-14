<template>
    <div class="slideshow-outbox">
        <div class="slideshow-content">
        </div>
        <!--<b-table class="small fixed" v-if="false && logs && logs.peaks.length" striped hover :items="items" :fields="fields"></b-table>
    -->
    </div>
</template>

<script>
    import Plottable from "plottable";
    import * as d3 from "d3";

    const entropy_delta_threshold = 0.3;
    const max_entropy_delta_num = 3;
    const colorSchema = [
        "#a6cee3",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a"
    ];

    function sum(vec) {
        var ret = 0;
        for (var i = 0; i < vec.length; ++i) {
            ret += vec[i];
        }
        return ret;
    }

    function peakViewRender(data, context) {
        const video = context.current_video;
        if (!video) return;
        const video_logs = video.video_logs;
        const video_peaks = video.video_peaks;
        if (!video_logs || !video_peaks) return;

        var xScale = new Plottable.Scales.Linear();
        var yScale = new Plottable.Scales.Linear();
        var scoreScale = new Plottable.Scales.Linear();
        var colorScale = new Plottable.Scales.Color();
        colorScale.domain(video_logs.map(d => d.type));
        colorScale.range(["#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);
        scoreScale.domain([0, 100]);
        var areaPlot = new Plottable.Plots.StackedArea();
        var dColorScale = new Plottable.Scales.Color();
        dColorScale.range(colorSchema);

        var duration = video.duration;
        for (const video_log of video_logs) {
            areaPlot.addDataset(
                new Plottable.Dataset(video_log.data).metadata(video_log.type)
            );
        }

        xScale.domain([0, duration + 1]);

        var entropyScale = new Plottable.Scales.InterpolatedColor();
        entropyScale.range(["#dbdde0", "#385fae"]);
        var entropyLegend = new Plottable.Components.InterpolatedColorLegend(
            entropyScale
        ).xAlignment("right");
        entropyScale.domain([
            Math.min(...video_peaks.map(d => d.entropy_delta)),
            Math.max(...video_peaks.map(d => d.entropy_delta)),
        ]);

        var peakPlot = new Plottable.Plots.Bar()
            .x(d => (d.start + d.end) / 2, xScale)
            .y(d => d.average_grade, scoreScale)
            .attr("width", d => 4)
            .attr("fill", d => d.entropy_delta, entropyScale)
            .attr("opacity", 0.6)
            .addDataset(new Plottable.Dataset(video_peaks));

        var peakCirclePlot = new Plottable.Plots.Scatter()
            .x(d => (d.start + d.end) / 2, xScale)
            .y(d => d.average_grade, scoreScale)
            .attr("stroke-width", 1.5)
            .attr("stroke", d => {
                if (
                    d.index < max_entropy_delta_num &&
                    d.entropy_delta > entropy_delta_threshold
                ) {
                    return dColorScale.scale(d.index + 1);
                } else {
                    return "#385fae";
                }
            })
            .size(10)
            .attr("opacity", d => {
                if (
                    d.index < max_entropy_delta_num &&
                    d.entropy_delta > entropy_delta_threshold
                ) {
                    return 0.9;
                } else {
                    return 0.2;
                }
            })
            .attr("fill", d => {
                if (
                    d.index < max_entropy_delta_num &&
                    d.entropy_delta > entropy_delta_threshold
                ) {
                    return dColorScale.scale(d.index + 1);
                } else {
                    return entropyScale.scale(d.entropy_delta);
                }
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
        var distributionScale = new Plottable.Scales.Linear();
        var distributionAxis = new Plottable.Axes.Numeric(distributionScale, "left");
        distributionAxis.formatter(d => ~~(d * 100) + "%");
        var distributionPlot = new Plottable.Plots.ClusteredBar();
        const overallSum = sum(video.grade_distribution);
        distributionPlot.addDataset(
            new Plottable.Dataset(
                video.grade_distribution.map(d => d / overallSum)
            ).metadata(0)
        );
        for (var i = 0; i < video_peaks.length && i < max_entropy_delta_num; ++i) {
            if (video_peaks[i].entropy_delta < entropy_delta_threshold) {
                break;
            }
            const current_sum = sum(video_peaks[i].grade_distribution);
            distributionPlot.addDataset(
                new Plottable.Dataset(
                    video_peaks[i].grade_distribution.map(d => d / current_sum)
                ).metadata(i + 1)
            );
        }

        distributionPlot
            .x((d, i) => i, scoreCategoryScale)
            .y(d => d, distributionScale)
            .attr("fill", (d, i, dataset) => dataset.metadata(), dColorScale);

        var dLegend = new Plottable.Components.Legend(dColorScale);
        dLegend.maxEntriesPerRow(5);
        dLegend
            .symbol(() => Plottable.SymbolFactories.circle())
            .xAlignment("center")
            .formatter(d => {
                if (d == 0) {
                    return "overall";
                } else {
                    const t = video_peaks[d - 1];
                    return "" + t.action + " peak at " + (t.start + t.end) / 2 + "s";
                }
            });

        var scoreCategoryAxis = new Plottable.Axes.Category(
            scoreCategoryScale,
            "bottom"
        );
        scoreCategoryAxis.formatter(d => `${d * 10}-${(d + 1) * 10}`);

        const distributionGroup = new Plottable.Components.Group([
            distributionPlot,
            dLegend
        ]);

        var table = new Plottable.Components.Table([
            [yLabel, legend, scoreLabel],
            [yAxis, plots, scoreAxis],
            [null, xAxis, null],
            [distributionAxis, distributionGroup, null],
            [null, scoreCategoryAxis, null]
        ]);

        document.getElementsByClassName("slideshow-content")[0].innerHTML = "";
        table.renderTo(".slideshow-content");
    }

    function problemActiviesRender(data, context) {
        var xScale = new Plottable.Scales.Time();
        var xAxis = new Plottable.Axes.Time(xScale, "bottom").yAlignment("bottom");
        var yScale = new Plottable.Scales.Linear();
        yScale.domain([0, 1]);

        document.getElementsByClassName("slideshow-content")[0].innerHTML = "";

        const problem = context.current_problem;
        if (!problem) return;
        const activies = problem.activies;
        if (!activies) return;
        var sample_activies = [];
        for (var i = 0; i < activies.length; ++i) {
            if (Math.random() < 200 / activies.length) {
                sample_activies.push(activies[i]);
            }
        }
        var range = [
            Math.min(...sample_activies.map(d => d.created)) - 3600 * 24 * 1000,
            Math.min(
                Math.min(...sample_activies.map(d => d.created)) + 3600 * 24 * 1000 * 14,
                Math.max(...sample_activies.map(d => d.created)) + 3600 * 24 * 1000,
            )
        ]
        xScale.domain([range[0], range[1]])
        sample_activies = sample_activies.filter(d => d.created >= range[0] && d.modified <= range[1]);

        var plots = new Plottable.Plots.Segment()
            .x(d => d.created, xScale)
            .y(10)
            .x2(d => d.modified, xScale)
            .y2(10)
            .attr("stroke", "none")
            .addDataset(new Plottable.Dataset(sample_activies));

        var table = new Plottable.Components.Table([[plots], [xAxis]]);
        table.renderTo(".slideshow-content");

        console.log(range, sample_activies);
        plots
            .content()
            .selectAll(".activies")
            .data(sample_activies)
            .enter()
            .append("path")
            .style("stroke-width", d => 0.5)
            .style("stroke", "#1f78b4")
            .style("fill", "none")
            .attr("class", "activies")
            .attr("transform", d => `translate(${
                (xScale._d3Scale(d.modified) + xScale._d3Scale(d.created)) / 2}, 500) rotate(270)`)
            .attr("d", d => {
                var r =
                    (xScale._d3Scale(d.modified) - xScale._d3Scale(d.created)) / 2;
                var ret = d3.arc()
                    .innerRadius(0)
                    .outerRadius(r)
                    .startAngle(Math.PI)
                    .endAngle(0);
                return ret();
            });
    }

    function problemAttemptsRender(data, context) {
        var xScale = new Plottable.Scales.Linear();
        var yScale = new Plottable.Scales.Linear();
        var xAxis = new Plottable.Axes.Numeric(xScale, "bottom").yAlignment("bottom");
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");

        document.getElementsByClassName("slideshow-content")[0].innerHTML = "";

        const problem = context.current_problem;
        if (!problem) return;
        const activies = problem.activies;
        if (!activies) return;
        
        var sample_activies = [];
        for (var i = 0; i < activies.length; ++i) {
            if (Math.random() < 200 / activies.length) {
                sample_activies.push(activies[i]);
            }
        }

        var plots = new Plottable.Plots.Scatter()
            .x(d => d.attempts, xScale)
            .y(d => d.final, yScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[1])
            .attr("opacity", d => d.grade == 0 ? 0.1 : 0.9)
            .addDataset(new Plottable.Dataset(sample_activies));

        var table = new Plottable.Components.Table([[yAxis, plots], [null, xAxis]]);
        table.renderTo(".slideshow-content");
    }

    function problemOverviewRender(data, context) {
        var yScale = new Plottable.Scales.Linear();
        var xScale = new Plottable.Scales.Category();
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

        document.getElementsByClassName("slideshow-content")[0].innerHTML = "";

        const problems = context.problems;
        if (!problems) return;

        var plot1 = new Plottable.Plots.Bar()
            .y(d => {
                var x = 0, y = 0;
                for (const t of d) {
                    x += t.grade;
                    y += t.max_grade;
                }
                return ~~(x / y * d.length);
            }, yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[1])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plot2 = new Plottable.Plots.Bar()
            .y(d => d.length, yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[0])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plots = new Plottable.Components.Group([plot2, plot1]);

        var table = new Plottable.Components.Table([[yAxis, plots], [null, xAxis]]);
        table.renderTo(".slideshow-content");
    }

    export default {
        data() {
            return {
                video_index: 0,
            };
        },
        props: ["slide", "context", "index"],
        computed: {
            /*
            fields() {
              const ret = [
                {
                  key: 'action',
                  sortable: true,
                },
                {
                  key: 'entropy_delta',
                  sortable: true,
                },
              ];
              for (var i = 0; i < 10; ++i) {
                ret.push({
                  key: `d${i}`,
                  label: `${i * 10}~${(i + 1) * 10}`,
                  sortable: true,
                });
              }
              return ret;
            },
            items() {
              const ret = [];
              const peaks = data.logs.peaks;
              for (var i = 0; i < peaks.length && i < 5; ++i) {
                if (peaks[i].entropy_delta < entropy_delta_threshold) {
                  break;
                }
                const current_sum = sum(peaks[i].grade_distribution);
                const item = {
                  action: peaks[i].action,
                  entropy_delta: Number(peaks[i].entropy_delta).toFixed(3),
                };
                for (var k = 0; k < peaks[k].grade_distribution.length; ++k) {
                  item[`d${k}`] = '' + 
                    Number(peaks[i].grade_distribution[k] / current_sum * 100).toFixed(1) + '%';
                }
                ret.push(item);
              }
              return ret;
            }
            */
        },
        methods: {
            paint() {
                if (!this.slide) {
                    return;
                }
                if (this.slide.type == "video_peaks") {
                    peakViewRender(this.slide, this.context);
                } else if (this.slide.type == "problem_activies") {
                    problemActiviesRender(this.slide, this.context);
                } else if (this.slide.type == "problem_attempts") {
                    problemAttemptsRender(this.slide, this.context);
                } else if (this.slide.type == "problem_overview") {
                    problemOverviewRender(this.slide, this.context);
                }
            }
        },
        watch: {
            index() {
                this.paint();
            },
        }
    };
</script>

<style scope>
    .slideshow-outbox {
        left: 0px;
        top: 0px;
        height: 69vh;
        width: 100%;
        background: rgb(233, 234, 236);
    }

    .slideshow-content {
        height: 67vh;
        width: 100%;
    }
</style>