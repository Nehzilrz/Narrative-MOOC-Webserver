<template>
    <div class="slideshow-outbox">
        <template v-for="item, index in slides">
        <!-- summary of students -->
            <template v-else-if="item.id=='student6'">
                <b-form-row style="padding-top: 5vh">
                    <b-col cols="1">
                    </b-col>
                    <b-col cols="4">
                        <div class="slideshow-content graph" style="height: 20vh; margin-top: 2vh; margin-bottom: 2vh;" :id="`${item.type}_${item.index}_0`">
                        </div>
                    </b-col>
                    <b-col cols="1">
                    </b-col>
                    <b-col cols="6">
                        <div class="slideshow-content text">
                            <h4>
                                {{item.data.education_highest_val}} 
                            </h4>
                            of thest students are {{item.data.education_highest_name}} graduates.
                        </div>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col cols="1">
                    </b-col>
                    <b-col cols="4">
                        <div class="slideshow-content graph" style="height: 20vh; margin-top: 2vh; margin-bottom: 2vh;" :id="`${item.type}_${item.index}_1`">
                        </div>
                    </b-col>
                    <b-col cols="1">
                    </b-col>
                    <b-col cols="6">
                        <div class="slideshow-content text">
                            <h4>
                                {{item.data.gender_highest_val}} 
                            </h4>
                                of thest students are {{item.data.gender_highest_name}}.
                        </div>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col cols="1">
                    </b-col>
                    <b-col cols="4">
                        <div class="slideshow-content graph" style="height: 20vh; margin-top: 2vh; margin-bottom: 2vh;" :id="`${item.type}_${item.index}_2`">
                        </div>
                    </b-col>
                    <b-col cols="1">
                    </b-col>
                    <b-col cols="6">
                        <div class="slideshow-content text">
                            <h4>
                                {{item.data.age_highest_val}} 
                            </h4>
                                of thest students are {{item.data.age_highest_name}} years old.
                        </div>
                    </b-col>
                </b-form-row> 
            </template>
        <!-- material start time -->
            <template v-else-if="item.id=='O3'">
                <div class="slideshow-content graph" style="height: 40vh" :id="`${item.type}_${item.index}`">
                </div>
                <div class="slideshow-content text">
                    <h6 style="font-weight: 600; padding-top: 1vh; padding-bottom: 0.5vh;"> 
                        Activies in this week:
                    </h6>
                    <ul>
                        <li>
                            The video the student started the latest was
                            <b-link href="javascript:void(0);" @click="onSelectVideo(item.data.max_video_activies.id)">
                                <span class="step" :style="{background: colorSchema[1]}">
                                    V
                                </span>                                
                                {{ item.data.max_video_activies_delay.name }}
                            </b-link>
                            , which started from {{ Number(item.data.max_video_activies_delay.delay).toFixed(1) }} 
                            days after the video released.
                        </li>
                        <li>
                            The video with the longest duration was 
                            <b-link href="javascript:void(0);" @click="onSelectVideo(item.data.max_video_activies.id)">
                                <span class="step" :style="{background: colorSchema[1]}">
                                    V
                                </span>
                                {{ item.data.max_video_activies_duration.name }}
                            </b-link>
                            , which spent {{ Number(item.data.max_video_activies_duration.duration).toFixed(1) }}
                            days.
                        </li>
                        <li style="margin-top: 1.5vh">
                            The assignment the student started the latest was
                            <b-link href="javascript:void(0);" @click="onSelectAssignment(item.data.max_video_activies.id)">
                               
                                <span class="step" :style="{background: colorSchema[3]}">
                                    A
                                </span>
                                 {{ item.data.max_assignment_activies_delay.name }}
                            </b-link>
                            , which started from {{ Number(item.data.max_assignment_activies_delay.delay).toFixed(1) }} 
                            days after the assignment released.
                        </li>
                        <li>
                            The assignment with the longest duration was 
                            <b-link href="javascript:void(0);" @click="onSelectAssignment(item.data.max_video_activies.id)">
                                <span class="step" :style="{background: colorSchema[3]}">
                                    A
                                </span>
                                {{ item.data.max_assignment_activies_duration.name }}
                            </b-link>
                            , which spent {{  Number(item.data.max_assignment_activies_duration.duration).toFixed(1) }}
                            days.
                        </li>
                    </ul>
                </div>
            </template>
        <!-- student difficulties -->
            <template v-else-if="item.id=='S4'">
                <div class="slideshow-content graph" style="height: 40vh" :id="`${item.type}_${item.index}`">
                </div>
                <div class="slideshow-content text">
                    <ul>
                        <li v-for="student in item.data.students">
                            {{ student.name }} students pay more attention on these video, which including
                            <b-link v-for="video in student.videos" href="javascript:void(0);" @click="onSelectVideo(video.id)">
                                <span class="step" :style="{background: colorSchema[1]}">
                                    V
                                </span>                                
                                {{ video.name }}
                                ,
                            </b-link>
                        </li>
                    </ul>
                </div>
            </template>
            <template v-else-if="item.id=='assignment2'">
                <div class="slideshow-content graph" style="height: 30vh" :id="`${item.type}_${item.index}`">
                </div>
                <div class="slideshow-content text">
                </div>
            </template>    
            <template v-else>
                <div class="slideshow-content graph" style="height: 60vh" :id="`${item.type}_${item.index}`">
                </div>
                <div class="slideshow-content text">
                </div>
            </template>
        </template>
    </div>
</template>

<script>
    import Plottable from "plottable";
    import * as d3 from "d3";
    import { setTimeout } from 'plottable/build/src/utils/windowUtils';
    import { axisRight } from 'd3';
    import MaterialPopularitySlide from './Slideshow/MaterialPopularity.vue';

    const entropy_delta_threshold = 0.3;
    const max_entropy_delta_num = 3;
    let isScrolling = false;

    function scrollTo(anchor, duration) {   
        if (!anchor) return;     
        var scrollTop = document.documentElement.scrollTop;
        if (Math.abs(anchor.offsetTop - scrollTop) < 100) {
            return;
        }
        if (isScrolling) {
            return;
        }
        isScrolling = true;        
        var step = (anchor.offsetTop - scrollTop) / (duration / 1000) / 50;            

        function scroll() {     
            if (Math.abs(anchor.offsetTop - scrollTop) > Math.abs(step)) {
                scrollTop += step;
                document.documentElement.scrollTop = scrollTop;
                setTimeout(scroll, 20);
                return;
            } else {
                isScrolling = false;
                return;
            }
        }
        scroll();
    }


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

    function video_peak_content(video, peak) {
        var distributionScale = new Plottable.Scales.Linear();
        var distributionAxis = new Plottable.Axes.Numeric(distributionScale, "left");
        distributionAxis.formatter(d => ~~(d * 100) + "%");
        var distributionPlot = new Plottable.Plots.ClusteredBar();

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
        colorScale.range(["lightgrey", colorSchema[peak.index]]);

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
    }

    function video_student_struggling_with(data, context) {
        let video_logs = data.video_logs;
        let video_peaks = data.video_peaks;
        console.log(data.video);
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
        dColorScale.range(colorSchema);

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
                return i < colorSchema.length ? colorSchema[i] : 'white';
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
    }

    function show_problem_activies(data, context) {
        var xScale = new Plottable.Scales.Time();
        var xAxis = new Plottable.Axes.Time(xScale, "bottom").yAlignment("bottom");
        var yScale = new Plottable.Scales.Linear();
        yScale.domain([0, 1]);


        const activies = data.activies;
        if (!activies) return null;
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
        return table;

        plots.content()
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

    function show_problem_attempts(data, context) {
        var xScale = new Plottable.Scales.Linear();
        var yScale = new Plottable.Scales.Linear();
        var xAxis = new Plottable.Axes.Numeric(xScale, "bottom").yAlignment("bottom");
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");


        const problem = data.current_problem;
        if (!problem) return null;
        const activies = problem.activies;
        if (!activies) return null;

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
        return table;
    }

    function eventHeatmapRender(data, context) {
        var events = data.events;
        if (!events) {
            return null;
        }
        events = events.map(d => ({ date: new Date(d.date), val: d.val }));

        var yScale = new Plottable.Scales.Category();
        var xScale = new Plottable.Scales.Category();

        var yAxis = new Plottable.Axes.Category(yScale, "left");
        var xAxis = new Plottable.Axes.Category(xScale, "bottom");
        function getDate(d) {
            return (d.getMonth() < 10 ? '0' : '') +
                d.getMonth() + '-' +
                (d.getDate() < 10 ? '0' : '') +
                d.getDate();
        }
        const hours = [];
        for (let i = 0; i < 24; ++i) {
            hours.push(i);
        }
        xScale.domain(hours);
        yScale.domain(Array.from(new Set(events.map(d => getDate(d.date)))).sort());

        xAxis.formatter((d) => {
            if (d < 12) {
                return (d + 1) + 'am'
            } else {
                return (d - 11) + 'pm';
            }
        });

        var colorScale = new Plottable.Scales.InterpolatedColor();
        colorScale.domain([Math.min(...events.map(d => d.val)), Math.max(...events.map(d => d.val))]);
        colorScale.range(['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']);

        var plot = new Plottable.Plots.Rectangle()
            .addDataset(new Plottable.Dataset(events))
            .x(d => d.date.getHours(), xScale)
            .y(d => getDate(d.date), yScale)
            .attr("fill", function (d) { return d.val; }, colorScale)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        var label = new Plottable.Components.TitleLabel("Activeness of This Week", 0)
            .xAlignment("center");

        var table = new Plottable.Components.Table([
            [null, label],
            [yAxis, plot],
            [null, xAxis]
        ]);

        return table;
    }

    function eventHeatmapRender2(data, context) {
        var data = context.activies_summary;
        if (!data) {
            return null;
        }
        data = data.map(d => ({ date: new Date(d.date), val: d.val }));
        var start = 0;
        while (start < data.length && !data[start].val) {
            ++start;
        }
        data = data.splice(start);

        while (data.length && !data[data.length - 1].val) {
            data.pop();
        }

        var xScale = new Plottable.Scales.Category();
        var yScale = new Plottable.Scales.Category();

        var xAxis = new Plottable.Axes.Category(xScale, "bottom");
        var yAxis = new Plottable.Axes.Category(yScale, "left");
        function getDate(d) {
            return (d.getMonth() < 10 ? '0' : '') +
                d.getMonth() + '-' +
                (d.getDate() < 10 ? '0' : '') +
                d.getDate();
        }
        const hours = [];
        for (let i = 0; i < 24; ++i) {
            hours.push(i);
        }
        yScale.domain(hours);
        yAxis.formatter((d) => {
            if (d < 12) {
                return (d + 1) + 'am'
            } else {
                return (d - 11) + 'pm';
            }
        });
        xScale.domain(Array.from(new Set(data.map(d => getDate(d.date)))).sort());

        var colorScale = new Plottable.Scales.InterpolatedColor();
        colorScale.domain([Math.min(...data.map(d => d.val)), Math.max(...data.map(d => d.val))]);
        colorScale.range(['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']);

        var plot = new Plottable.Plots.Rectangle()
            .addDataset(new Plottable.Dataset(data))
            .x(d => getDate(d.date), xScale)
            .y(d => d.date.getHours(), yScale)
            .attr("fill", function (d) { return d.val; }, colorScale)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        var label = new Plottable.Components.TitleLabel("Activeness of This Semister", 0)
            .xAlignment("center");

        var table = new Plottable.Components.Table([
            [null, label],
            [yAxis, plot],
            [null, xAxis]
        ]);

        return table;
    }

    function eventHeatmapRender3(data, context) {
        var data = context.activies_summary;
        if (!data) {
            return null;
        }
        data = data.map(d => ({ date: new Date(d.date), val: d.val }));
        while (data.length && !data[data.length - 1].val) {
            data.pop();
        }

        var yScale = new Plottable.Scales.Category();
        var xScale = new Plottable.Scales.Category();

        var yAxis = new Plottable.Axes.Category(yScale, "left");
        var xAxis = new Plottable.Axes.Category(xScale, "bottom");
        xScale.domain(Array.from(new Set(data.map(d => ~~(d.date / 86400000 / 7)))).sort(
            (a, b) => (+a) - (+b)
        ));
        yScale.domain(Array.from(new Set(data.map(d => d.date.getDay()))).sort());

        var colorScale = new Plottable.Scales.InterpolatedColor();
        colorScale.domain([Math.min(...data.map(d => d.val)), Math.max(...data.map(d => d.val))]);
        colorScale.range(['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']);

        var plot = new Plottable.Plots.Rectangle()
            .addDataset(new Plottable.Dataset(data))
            .x(d => ~~(d.date / 86400000 / 7), xScale)
            .y(d => d.date.getDay(), yScale)
            .attr("fill", function (d) { return d.val; }, colorScale)
            .attr("stroke", "#fff")
            .attr("stroke-width", 2);

        var label = new Plottable.Components.TitleLabel("Activeness of This Week", 0)
            .xAlignment("center");

        var table = new Plottable.Components.Table([
            [null, label],
            [yAxis, plot],
            [null, xAxis]
        ]);

        return table;
    }

    function problemOverviewRender(data, context) {
        let problems = data.problem_activies;
        if (!problems) return null;

        problems = problems.filter((d) => d.name);
        console.log(problems);
        var yScale = new Plottable.Scales.Linear();
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
        xAxis.formatter(d => problems[d].name || ('' + d));

        var plot1 = new Plottable.Plots.Bar()
            .y(d => ~~(d.grade / d.max_grade * d.activeness), yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[1])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plot2 = new Plottable.Plots.Bar()
            .y(d => d.activeness, yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[0])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var durationScale = new Plottable.Scales.Linear();
        var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
        var attemptScale = new Plottable.Scales.Linear();
        var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
        durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)

        var durationPlot = new Plottable.Plots.Bar()
            .y(d => d.duration, durationScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[2])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var attemptPlot = new Plottable.Plots.Bar()
            .y(d => d.attempts, attemptScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[3])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var delayScale = new Plottable.Scales.Linear();
        var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
            .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
        var delayPlot = new Plottable.Plots.Bar()
            .y(d => {
                console.log(d.created, (context.id2item[d.id] && context.id2item[d.id].chapter_start));
                return d.created - +(context.id2item[d.id] && context.id2item[d.id].chapter_start);
            }, delayScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[4])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plots = new Plottable.Components.Group([plot2, plot1]);

        var correctLabel = new Plottable.Components.AxisLabel("Number of Correct", "0");
        var studentNumLabel = new Plottable.Components.AxisLabel("Number of Students", "0");

        var attemptAxisLable = new Plottable.Components.AxisLabel("Number of Attempts", "0");
        var attemptPlotLable = new Plottable.Components.AxisLabel("The attempts spend on the problem", "0");

        var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
        var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the problem", "0");

        var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
        var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

        var table = new Plottable.Components.Table([
            [delayAxisLable, delayPlotLable],
            [delayAxis, delayPlot],
            [attemptAxisLable, attemptPlotLable],
            [attemptAxis, attemptPlot],
            [durationAxisLable, durationPlotLable],
            [durationAxis, durationPlot],
            [studentNumLabel, correctLabel],
            [yAxis, plots],
            [null, xAxis]
        ]);
        return table;
    }

    function student_characteristics(data, context) {
        var users = data.user_info;

        var education_dict = {};
        for (const user of users) {
            if (!education_dict[user.level_of_education]) {
                education_dict[user.level_of_education] = 0;
            }
            education_dict[user.level_of_education] += 1;
        }
        var education_level_map = {
            hs: 'High School',
            a: 'Adult',
            b: 'Bachelor',
            m: 'Master or Above',
            other: 'Other',
        };
        var education_data = Object.keys(education_dict)
            .map(d => ({ name: education_level_map[d] || '', val: education_dict[d] }))
            .filter(d => d.name != "")
            .sort((a, b) => b.val - a.val);

        var edu_scale = new Plottable.Scales.Linear();
        var edu_color_scale = new Plottable.Scales.Color();
        edu_color_scale.range(colorSchema);

        var education_data_sum = education_data.map(d => d.val).reduce((a, b) => a + b, 0);
        var edu_plot = new Plottable.Plots.Pie()
            .addDataset(new Plottable.Dataset(education_data))
            .sectorValue(d => d.val, edu_scale)
            .attr("fill", d => d.name, edu_color_scale)
            .animated(true)
            .outerRadius(80)
            .labelsEnabled(true)
            .labelFormatter((d) => Number(d / education_data_sum * 100).toFixed(1) + '%');
        data.education_highest_name = education_data[0].name;
        data.education_highest_val = Number(education_data[0].val / education_data_sum * 100).toFixed(1) + '%';

        var edu_legend = new Plottable.Components.Legend(edu_color_scale);
        edu_legend.maxEntriesPerRow(1);
        edu_legend
            .symbol(() => Plottable.SymbolFactories.circle())
            .xAlignment("right");

        var gender_dict = {};
        for (const user of users) {
            if (!gender_dict[user.gender]) {
                gender_dict[user.gender] = 0;
            }
            gender_dict[user.gender] += 1;
        }
        var gender_map = {
            f: 'Female',
            m: 'Male',
        };
        var gender_data = Object.keys(gender_dict)
            .map(d => ({ name: gender_map[d] || '', val: gender_dict[d] }))
            .filter(d => d.name != "")
            .sort((a, b) => b.val - a.val);

        var gender_scale = new Plottable.Scales.Linear();
        var gender_color_scale = new Plottable.Scales.Color();
        gender_color_scale.range(colorSchema);

        var gender_data_sum = gender_data.map(d => d.val).reduce((a, b) => a + b, 0);
        var gender_plot = new Plottable.Plots.Pie()
            .addDataset(new Plottable.Dataset(gender_data))
            .sectorValue(d => d.val, gender_scale)
            .attr("fill", d => d.name, gender_color_scale)
            .animated(true)
            .labelsEnabled(true)
            .outerRadius(80)
            .labelFormatter((d) => Number(d / gender_data_sum * 100).toFixed(1) + '%');
        
        var gender_legend = new Plottable.Components.Legend(gender_color_scale);
        gender_legend.maxEntriesPerRow(1);
        gender_legend
            .symbol(() => Plottable.SymbolFactories.circle())
            .xAlignment("right");
        data.gender_highest_name = gender_data[0].name;
        data.gender_highest_val = Number(gender_data[0].val / gender_data_sum * 100).toFixed(1) + '%';

        var age_dict = {};

        for (const user of users) {
            var i = ~~((2014 - user.year_of_birth) / 10);
            if (i > 5) i = 5;
            if (!age_dict[i]) {
                age_dict[i] = 0;
            }
            age_dict[i] += 1;
        }
        
        var age_data = [0, 1, 2, 3, 4, 5]
            .map(d => ({
                name: `${d * 10} - ` + (d == 5 ? '' : `${d * 10 + 10}`), 
                val: age_dict[d] || 0
            }));
            
        var age_scale = new Plottable.Scales.Linear();
        var age_color_scale = new Plottable.Scales.Color();
        age_color_scale.range(colorSchema);

        var age_data_sum = gender_data.map(d => d.val).reduce((a, b) => a + b, 0);
        var age_plot = new Plottable.Plots.Pie()
            .addDataset(new Plottable.Dataset(age_data))
            .sectorValue(d => d.val, age_scale)
            .attr("fill", d => d.name, age_color_scale)
            .animated(true)
            .labelsEnabled(true)
            .outerRadius(80)
            .labelFormatter((d) => Number(d / age_data_sum * 100).toFixed(1) + '%');
        
        var age_legend = new Plottable.Components.Legend(age_color_scale);
        age_legend.maxEntriesPerRow(1);
        age_legend
            .symbol(() => Plottable.SymbolFactories.circle())
            .xAlignment("right");

        var k = 0;
        for (var i = 1; i < age_data.length; ++i) {
            if (age_data[i].val > age_data[k].val) {
                k = i;
            }
        }
        data.age_highest_name = age_data[k].name;
        data.age_highest_val = Number(age_data[k].val / age_data_sum * 100).toFixed(1) + '%';

        var table = [
            new Plottable.Components.Table([
                [edu_legend, edu_plot],
            ]),
            new Plottable.Components.Table([
                [gender_legend, gender_plot],
            ]),
            new Plottable.Components.Table([
                [age_legend, age_plot],
            ])
        ];
        return table;
    }

    function problemOverviewRenderCorrectness(data, context) {
        let problems = data.problem_activies;
        if (!problems) return null;

        problems = problems.filter((d) => d.name);
        var yScale = new Plottable.Scales.Linear();
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
        xAxis.formatter(d => problems[d].name || ('' + d));

        var plot1 = new Plottable.Plots.Bar()
            .y(d => ~~(d.grade / d.max_grade * d.activeness), yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[1])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plot2 = new Plottable.Plots.Bar()
            .y(d => d.activeness, yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[0])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var durationScale = new Plottable.Scales.Linear();
        var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
        var attemptScale = new Plottable.Scales.Linear();
        var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
        durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)

        var durationPlot = new Plottable.Plots.Bar()
            .y(d => d.duration, durationScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[2])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var attemptPlot = new Plottable.Plots.Bar()
            .y(d => d.attempts, attemptScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[3])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var delayScale = new Plottable.Scales.Linear();
        var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
            .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
        var delayPlot = new Plottable.Plots.Bar()
            .y(d => {
                console.log(d.created, (context.id2item[d.id] && context.id2item[d.id].chapter_start));
                return d.created - +(context.id2item[d.id] && context.id2item[d.id].chapter_start);
            }, delayScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[4])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plots = new Plottable.Components.Group([plot2, plot1]);

        var correctLabel = new Plottable.Components.AxisLabel("Number of Correct", "0");
        var studentNumLabel = new Plottable.Components.AxisLabel("Number of Students", "0");

        var attemptAxisLable = new Plottable.Components.AxisLabel("Number of Attempts", "0");
        var attemptPlotLable = new Plottable.Components.AxisLabel("The attempts spend on the problem", "0");

        var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
        var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the problem", "0");

        var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
        var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

        var table = new Plottable.Components.Table([
            [studentNumLabel, correctLabel],
            [yAxis, plots],
            [null, xAxis]
        ]);
        return table;
    }


    function assignmentAttemptsAndCorrectness(data, context) {
        let problems = data.problem_activies;
        if (!problems) return null;

        problems = problems.filter((d) => d.name);
        var yScale = new Plottable.Scales.Linear();
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
        xAxis.formatter(d => problems[d].name || ('' + d));
        yAxis.formatter((d) => d + '%');

        var plot1 = new Plottable.Plots.Bar()
            .x((d, i) => i, xScale)
            .y(d => d.grade / d.max_grade * 100, yScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[1])
            .animated(true)
            .labelsEnabled(true)
            .labelFormatter((d) => Number(d).toFixed(1) + '%')
            .addDataset(new Plottable.Dataset(problems));

        var attemptScale = new Plottable.Scales.Linear();
        var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");

        var attemptPlot = new Plottable.Plots.Bar()
            .y(d => d.attempts, attemptScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[3])
            .animated(true)
            .labelsEnabled(true)
            .addDataset(new Plottable.Dataset(problems));

        var studentNumLabel = new Plottable.Components.AxisLabel("Correctness", "0");
        var attemptAxisLable = new Plottable.Components.AxisLabel("Attempts", "0");

        var table = new Plottable.Components.Table([
            [attemptAxisLable, null],
            [attemptAxis, attemptPlot],
            [studentNumLabel, null],
            [yAxis, plot1],
            [null, xAxis]
        ]);
        return table;
    }

    function problemOverviewRender3(data, context) {
        let problems = data.problem_activies;
        if (!problems) return null;

        problems = problems.filter((d) => d.name);
        var yScale = new Plottable.Scales.Linear();
        var yAxis = new Plottable.Axes.Numeric(yScale, "left").xAlignment("left");
        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
        xAxis.formatter(d => problems[d].name || ('' + d));

        var plot1 = new Plottable.Plots.Bar()
            .y(d => ~~(d.grade / d.max_grade * d.activeness), yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[1])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plot2 = new Plottable.Plots.Bar()
            .y(d => d.activeness, yScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[0])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var durationScale = new Plottable.Scales.Linear();
        var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
        var attemptScale = new Plottable.Scales.Linear();
        var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
        durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)

        var durationPlot = new Plottable.Plots.Bar()
            .y(d => d.duration, durationScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[2])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var attemptPlot = new Plottable.Plots.Bar()
            .y(d => d.attempts, attemptScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[3])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var delayScale = new Plottable.Scales.Linear();
        var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
            .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
        var delayPlot = new Plottable.Plots.Bar()
            .y(d => {
                console.log(d.created, (context.id2item[d.id] && context.id2item[d.id].chapter_start));
                return d.created - +(context.id2item[d.id] && context.id2item[d.id].chapter_start);
            }, delayScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[4])
            .animated(true)
            .addDataset(new Plottable.Dataset(problems));

        var plots = new Plottable.Components.Group([plot2, plot1]);

        var correctLabel = new Plottable.Components.AxisLabel("Number of Correct", "0");
        var studentNumLabel = new Plottable.Components.AxisLabel("Number of Students", "0");

        var attemptAxisLable = new Plottable.Components.AxisLabel("Number of Attempts", "0");
        var attemptPlotLable = new Plottable.Components.AxisLabel("The attempts spend on the problem", "0");

        var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
        var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the problem", "0");

        var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
        var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

        var table = new Plottable.Components.Table([
            [delayAxisLable, delayPlotLable],
            [delayAxis, delayPlot],
            [durationAxisLable, durationPlotLable],
            [durationAxis, durationPlot],
            [studentNumLabel, correctLabel],
            [yAxis, plots],
            [null, xAxis]
        ]);
        return table;
    }

    function show_which_student_difficulties(data, context) {
        let student_overview = data.student_overview;
        if (!student_overview) return null;

        student_overview = student_overview.filter((d) => context.id2item[d.id]);
        student_overview = student_overview.sort((a, b) => b.length[3].value - a.length[3].value);

        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom");
        xAxis.formatter(d => context.id2item[student_overview[d].id].name);

        var yScale = new Plottable.Scales.Linear();
        var yAxis = new Plottable.Axes.Numeric(yScale, "left");

        var studentPlot = new Plottable.Plots.ClusteredBar();
        var colorScale = new Plottable.Scales.Color();
        colorScale.range(colorSchema.slice(0, 4));

        data.students = [];
        for (var i = 3; i >= 0; --i) {
            studentPlot.addDataset(new Plottable.Dataset(
                    student_overview.map(d => d.length[i].value)
                ).metadata(student_overview[0].length[i].name)
            );
            var name = student_overview[0].length[i].name;
            if (name.includes('the'))
                name = name.replace('the', 'The');
            else
                name = 'The ' + name;
            data.students[i] = {
                name: name,
                videos: student_overview.map((d, j) => [d.length[i].value, j])
                    .sort((a, b) => b[0] - a[0])
                    .slice(0, 3)
                    .map((d) => student_overview[d[1]].id)
                    .map(d => ({ id: d, name: context.id2item[d].name }))
            };
        }

        studentPlot.x((d, i) => i, xScale)
            .y(d => d, yScale)
            .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale);

        var legend = new Plottable.Components.Legend(colorScale);
            legend.maxEntriesPerRow(1);
        legend
            .symbol(() => Plottable.SymbolFactories.circle())
            .xAlignment("right"); 
        legend.formatter((d) => d + ' students');
        
        var plots = new Plottable.Components.Group([
            studentPlot, legend
        ]);

        var table = new Plottable.Components.Table([
            [yAxis, plots],
            [null, xAxis],
        ]);
        return table;
    }

    function videoOverviewRender2(data, context) {
        const video_activies = data.video_activies;
        if (!video_activies) return null;

        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
        xAxis.formatter(d => video_activies[d].name);

        var watchTimeScale = new Plottable.Scales.Linear();
        var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
        watchTimeAxis.formatter((d) => Number(d / 60).toFixed(1))
        var watchTimePlot = new Plottable.Plots.Bar()
            .y(d => d.video_watch_time, watchTimeScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[6])
            .animated(true)
            .addDataset(new Plottable.Dataset(video_activies));

        data.most_attempts = video_activies.map(d => ({ name: d.name, id: d.id, attempts: d.attempts }))
            .sort((a, b) => b.attempts - a.attempts)
            .slice(0, 3);

        data.least_attempts = video_activies.map(d => ({ name: d.name, id: d.id, attempts: d.attempts }))
            .sort((a, b) => a.attempts - b.attempts)
            .slice(0, 3);

        data.most_watch = video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
            .sort((a, b) => b.watch_time - a.watch_time)
            .slice(0, 3);

        data.least_watch = video_activies.map(d => ({ name: d.name, id: d.id, watch_time: d.video_watch_time / 60 }))
            .sort((a, b) => a.watch_time - b.watch_time)
            .slice(0, 3);

        var attemptScale = new Plottable.Scales.Linear();
        var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
        var attemptPlot = new Plottable.Plots.Bar()
            .y(d => d.attempts, attemptScale)
            .x((d, i) => i, xScale)
            .attr("stroke", "none")
            .attr("fill", colorSchema[7])
            .animated(true)
            .addDataset(new Plottable.Dataset(video_activies));

        var attemptAxisLable = new Plottable.Components.AxisLabel("times", "0");
        var attemptPlotLable = new Plottable.Components.AxisLabel("video view times", "0");

        var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
        var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

        var table = new Plottable.Components.Table([
            [attemptAxisLable, attemptPlotLable],
            [attemptAxis, attemptPlot],
            [watchTimeLabel, watchTimePlotLabel],
            [watchTimeAxis, watchTimePlot],
            [null, xAxis]
        ]);
        return table;
    }

    function materialStartTimeRender(data, context) {
        const video_activies = data.video_activies;
        if (!video_activies) return null;
        const problem_activies = data.problem_activies;
        if (!problem_activies) return null;

        const activies = [];
        for (const d of video_activies) {
            d.duration = (d.modified - d.created) / 86400000;
            d.delay = (d.created - (context.id2item[d.id] && context.id2item[d.id].chapter_start)) / 86400000;
            activies.push({
                duration: d.duration,
                delay: d.delay,
                name: d.name,
                type: 'video',
            });
        }
        for (const d of problem_activies) {
            d.duration = (d.modified - d.created) / 86400000;
            d.delay = (d.created - (context.id2item[d.id] && context.id2item[d.id].chapter_start)) / 86400000;
            activies.push({
                duration: d.duration,
                delay: d.delay,
                name: d.name,
                type: 'assignment',
            });
        }

        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

        var colorScale = new Plottable.Scales.Color();
        colorScale.domain(['video delay', 'video duration', 'assignment delay', 'assignment duration']);
        data.video_color = colorSchema[1];
        data.assignment_color = colorSchema[3];
        colorScale.range(colorSchema.slice(0, 4));

        const max_video_activies_duration = Math.max(...video_activies.map(d => d.duration));
        const max_video_activies_delay = Math.max(...video_activies.map(d => d.delay));
        const max_assignment_activies_duration = Math.max(...problem_activies.map(d => d.duration));
        const max_assignment_activies_delay = Math.max(...problem_activies.map(d => d.delay));
        data.max_video_activies_duration = video_activies.find(d => d.duration == max_video_activies_duration);
        data.max_video_activies_delay = video_activies.find(d => d.delay == max_video_activies_delay);
        data.max_assignment_activies_duration = problem_activies.find(d => d.duration == max_assignment_activies_duration);
        data.max_assignment_activies_delay = problem_activies.find(d => d.delay == max_assignment_activies_delay);

        var activenessScale = new Plottable.Scales.Linear();
        var activenessAxis = new Plottable.Axes.Numeric(activenessScale, "left").xAlignment("left");
        var activenessPlot = new Plottable.Plots.Bar()
            .y(d => d.value, activenessScale)
            .x(d => d.name, xScale)
            .attr("stroke", "none")
            .attr("fill", (d, i, dataset) => `${d.type} ${dataset.metadata()}`, colorScale)
            .animated(true)
            .addDataset(new Plottable.Dataset(activies.map(d => ({ type: d.type, name: d.name, value: d.duration + d.delay }))).metadata('duration'))            
            .addDataset(new Plottable.Dataset(activies.map(d => ({ type: d.type, name: d.name, value: d.delay }))).metadata('delay'));


        var legend = new Plottable.Components.Legend(colorScale);
            legend.maxEntriesPerRow(1);
            legend
                .symbol(() => Plottable.SymbolFactories.circle())
                .xAlignment("right");        
                
        var yLabel = new Plottable.Components.AxisLabel("Days", "0");

        var table = new Plottable.Components.Table([
            [yLabel, legend],
            [activenessAxis, activenessPlot],
            [null, xAxis]
        ]);

        return table;
    }

    function activeness_different_material(data, context) {
        const video_activies = data.video_activies;
        if (!video_activies) return null;
        const problem_activies = data.problem_activies;
        if (!problem_activies) return null;

        var xScale = new Plottable.Scales.Category();
        var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

        var colorScale = new Plottable.Scales.Color();
        colorScale.domain(['video', 'assignment']);
        data.video_color = colorSchema[1];
        data.assignment_color = colorSchema[3];
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
    }


    export default {
        data() {
            return {
                slide_index: 0,
                slides: [],
                colorSchema: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", 
                    "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"
                ],
                show_video: [],
            };
        },
        props: ["slide", "context", "trigger"],
        components: {
            MaterialPopularitySlide,
        },
        computed: {
            slide_render() {
                return {
                    'Where in the video are students struggling with?': () => this.paintVideoPeakView(),
                    '': () => this.paintProblemActiviesView(),
                    '': () => this.paintProblemAttemptScatter(),
                    '': () => this.paintProblemTimeSpendView(),
                    'Which assignments have the greatest number of attempts?': () => this.paintProblemAttemptsBarChart(),
                    'When do students start/finish the assignments?': () => this.paintProblemStartTimeView(),
                    'How much video content have students completed?': () => this.paintVideoCompleted(),
                    'How much time do students spend on different videos?': () => this.paintVideoTimeSpend(),
                    'When do students start or finish the course materials?': () => this.paintStartTimeView(),
                    'How much video content have students completed?': () => this.paintVideoCompleted(),
                    'How often do students access course materials?': () => this.paintChapterAccessOverview(),
                    '': () => this.paintCourseAccessOverview(),
                    'How well do students perform?': () => this.paintAssignmentCorrectness(),
                    'How many assignments do students finish?': () => this.paintAssignmentCompleteness(),
                    'How often do students review each video?': () => this.paintVideoReviewFrequency(),
                    'Which students are having difficulties?': () => this.paintStudentDifficulties(),
                    'What are the characteristics of these students': () => this.paintStudentCharacteristics(),
                    'What are the popularity of different materials?': () => this.paintActivenessDifferentMaterial(),
                };
            }
        },
        methods: {
            slideGraphRender() {
                this.slide_render[this.slide.name]();
            },
            paint() {
                if (!this.slide) {
                    return null;
                }
                var item = null;
                if (item = this.slides.find(d => this.slide.type == d.type && this.slide.index == d.index)) {
                    scrollTo(document.getElementById(`${item.type}_${item.index}`), 1000);
                    return;
                }
                this.slideGraphRender();
                this.slides.push(this.slide);
            },
            paintProblemStartTimeView() {
                let table = problemOverviewRender3(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintVideoTimeSpend() {
                let table = videoOverviewRender2(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintVideoCompleted() {
                let table = videoOverviewRender(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintProblemAttemptsBarChart() {
                let table = assignmentAttemptsAndCorrectness(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintProblemTimeSpendView() {
                let table = problemOverviewRender(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintProblemActiviesView() {
                let table = show_problem_activies(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintProblemActiviesView() {
                let table = show_problem_activies(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintProblemAttemptScatter() {
                let table = show_problem_attempts(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintStartTimeView() {
                let table = materialStartTimeRender(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintChapterAccessOverview() {
                let table = eventHeatmapRender(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintCourseAccessOverview() {
                let table = eventHeatmapRender2(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintAssignmentCompleteness() {
                let table = problemOverviewRenderCorrectness(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintAssignmentCorrectness() {
                let table = problemOverviewRenderCorrectness(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            // 
            paintVideoReviewFrequency() {
                let table = videoReviewRender(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintStudentDifficulties() {
                let table = show_which_student_difficulties(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            paintActivenessDifferentMaterial() {
                let table = activeness_different_material(this.slide.data, this.context);
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },

            // Finished
            paintVideoPeakView() {
                let table = video_student_struggling_with(this.slide.data, this.context);
                this.slide.data.showed_peaks = [];
                for (var i = 0; i < 3 && i < this.slide.data.video_peaks.length; ++i) {
                    this.slide.data.showed_peaks.push(
                        this.top_video_peaks(this.slide, i)
                    );
                }
                this.$nextTick(() => {
                    var element = document.getElementById(`${this.slide.type}_${this.slide.index}`);
                    table.renderTo(element);
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
            onVideoPeakChangeTime(index, peak, video) {
                this.$set(this.show_video, index, true);
                document.getElementById('peak_embed_video' + index).currentTime = peak.time;
                const table = video_peak_content(video, peak);
                this.$nextTick(() => {
                    const element = document.getElementById('peak_embed_chart' + index);
                    element.innerHTML = '';     
                    table.renderTo(element);
                });
            },
            onSelectVideo(id) {
                this.context.loadData(this.context.slides.find(
                    d => d.type == 'video' && d.resource_id == id
                ));
            },
            onSelectProblem(id) {
                this.context.loadData(this.context.slides.find(
                    d => d.id == 'assignment2'
                ));
            },
            onShowMorePeaks(item) {
                item.data.showed_peaks.push(
                    this.top_video_peaks(item, item.data.showed_peaks.length)
                );
                this.$forceUpdate();
            },
            onSelectStudents(users, name) {
                this.context.addSlide({
                    name: `What are the characteristics of these students?`,
                    type: 'student_characteristics',
                    resources: ['user_basic_info'],
                    data: { users: users },
                    id: '',
                    category: 'student',
                });
                this.context.loadData(this.context.lastSlide());
            },
            onShowDifferentStudent() {
                this.context.loadData(this.context.slides.find(
                    d => d.type == 'which_student_difficulties'
                ));
            },
            onShowMoreOverview() {
                this.context.loadData(this.context.slides.find(
                    d => d.type == 'start_on_materials'
                ));
            },
            onShowMoreVideoOverview() {
                this.context.loadData(this.context.slides.find(
                    d => d.type == 'time_on_videos'
                ));
            },
            onShowMoreVideoOverview2() {

            },
            onShowMoreAssignmentOverview2() {
                this.context.loadData(this.context.slides.find(
                    d => d.type == 'assignments_greatest_attempts'
                ));
            },
            onShowMoreAssignmentOverview() {
                this.context.loadData(this.context.slides.find(
                    d => d.type == 'assignments_greatest_attempts'
                ));
            },
            paintStudentCharacteristics() {
                let table = student_characteristics(this.slide.data, this.context);
                this.$nextTick(() => {
                    table[0].renderTo(document.getElementById(`${this.slide.type}_${this.slide.index}_0`));
                    table[1].renderTo(document.getElementById(`${this.slide.type}_${this.slide.index}_1`));
                    table[2].renderTo(document.getElementById(`${this.slide.type}_${this.slide.index}_2`));
                    this.$sr.reveal(".slideshow-content", {
                        duration: 500,
                        viewFactor: 0.4,
                        rotate: {x: 65},
                    });
                    scrollTo(document.getElementById(`${this.slide.type}_${this.slide.index}`), 1000);
                });
            },
        },
        watch: {
            trigger() {
                this.paint();
            },
        }
    };
</script>

<style scope>
.slideshow-outbox {
  left: 0px;
  top: 0px;
  min-height: 100%;
  width: 100%;
  padding-bottom: 10vh;
  background: rgb(243, 244, 246);
}

.slideshow-content {
  width: 90%;
  left: 3vw;
  position: relative;
}

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

.slideshow-content.title {
    font-weight: 800;
    text-align: center;
    padding-top: 5vh;
    padding-bottom: 2vh;
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

