
import Plottable from "plottable";
import * as d3 from "d3";

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

export function peakViewRender(data, context) {
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
    for (var i = 0; i < Math.min(video_peaks.length, 8); ++i) {
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

    return table;
}

export function problemActiviesRender(data, context) {
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

export function problemAttemptsRender(data, context) {
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

export function eventHeatmapRender(data, context) {
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

export function eventHeatmapRender2(data, context) {
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

export function eventHeatmapRender3(data, context) {
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

export function problemOverviewRender(data, context) {


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

    console.log(context.item_map);
    var delayScale = new Plottable.Scales.Linear();
    var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
        .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
    var delayPlot = new Plottable.Plots.Bar()
        .y(d => {
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - +(context.item_map[d.id] && context.item_map[d.id].chapter_start);
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


export function problemOverviewRenderCorrectness(data, context) {
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
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - +(context.item_map[d.id] && context.item_map[d.id].chapter_start);
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


export function problemOverviewRender2(data, context) {


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

    console.log(context.item_map);
    var delayScale = new Plottable.Scales.Linear();
    var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
        .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
    var delayPlot = new Plottable.Plots.Bar()
        .y(d => {
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - +(context.item_map[d.id] && context.item_map[d.id].chapter_start);
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
        [attemptAxisLable, attemptPlotLable],
        [attemptAxis, attemptPlot],
        [studentNumLabel, correctLabel],
        [yAxis, plots],
        [null, xAxis]
    ]);
    return table;
}

export function problemOverviewRender3(data, context) {


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
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - +(context.item_map[d.id] && context.item_map[d.id].chapter_start);
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


export function videoReviewRender(data, context) {
    const video_activies = data.video_activies;
    if (!video_activies) return null;

    var xScale = new Plottable.Scales.Category();
    var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
    xAxis.formatter(d => video_activies[d].name);

    var watchTimeScale = new Plottable.Scales.Linear();
    var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
    var watchTimePlot = new Plottable.Plots.Bar()
        .y(d => d.video_watch_time, watchTimeScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[0])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var durationScale = new Plottable.Scales.Linear();
    var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
    durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)
    var durationPlot = new Plottable.Plots.Bar()
        .y(d => d.modified - d.created, durationScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[1])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptScale = new Plottable.Scales.Linear();
    var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
    var attemptPlot = new Plottable.Plots.Bar()
        .y(d => d.attempts, attemptScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[2])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var delayScale = new Plottable.Scales.Linear();
    var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
        .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
    var delayPlot = new Plottable.Plots.Bar()
        .y(d => {
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - (context.item_map[d.id] && context.item_map[d.id].chapter_start);
        }, delayScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[4])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptAxisLable = new Plottable.Components.AxisLabel("times", "0");
    var attemptPlotLable = new Plottable.Components.AxisLabel("video view times", "0");

    var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
    var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the video", "0");

    var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
    var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

    var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
    var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

    var table = new Plottable.Components.Table([
        [attemptAxisLable, attemptPlotLable],
        [attemptAxis, attemptPlot],
        [null, xAxis]
    ]);
    return table;
}

export function videoOverviewRender(data, context) {
    const video_activies = data.video_activies;
    if (!video_activies) return null;

    var xScale = new Plottable.Scales.Category();
    var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
    xAxis.formatter(d => video_activies[d].name);

    var watchTimeScale = new Plottable.Scales.Linear();
    var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
    var watchTimePlot = new Plottable.Plots.Bar()
        .y(d => d.video_watch_time, watchTimeScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[0])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var durationScale = new Plottable.Scales.Linear();
    var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
    durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)
    var durationPlot = new Plottable.Plots.Bar()
        .y(d => d.modified - d.created, durationScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[1])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptScale = new Plottable.Scales.Linear();
    var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
    var attemptPlot = new Plottable.Plots.Bar()
        .y(d => d.attempts, attemptScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[2])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var delayScale = new Plottable.Scales.Linear();
    var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
        .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
    var delayPlot = new Plottable.Plots.Bar()
        .y(d => {
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - (context.item_map[d.id] && context.item_map[d.id].chapter_start);
        }, delayScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[4])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptAxisLable = new Plottable.Components.AxisLabel("times", "0");
    var attemptPlotLable = new Plottable.Components.AxisLabel("video view times", "0");

    var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
    var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the video", "0");

    var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
    var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

    var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
    var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

    var table = new Plottable.Components.Table([
        [watchTimeLabel, watchTimePlotLabel],
        [watchTimeAxis, watchTimePlot],
        [null, xAxis]
    ]);
    return table;
}

export function videoGoodBadStudentRender(data, context) {
    let student_overview = data.student_overview;
    if (!student_overview) return null;

    student_overview = student_overview.filter((d) => context.item_map[d.id]);
    student_overview = student_overview.sort((a, b) => b.length[3].value - a.length[3].value);

    var xScale = new Plottable.Scales.Category();
    var xAxis = new Plottable.Axes.Category(xScale, "bottom");
    xAxis.formatter(d => context.item_map[student_overview[d].id].name);

    var yScale = new Plottable.Scales.Linear();
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

    var studentPlot = new Plottable.Plots.ClusteredBar();
    for (var i = 3; i >= 0; --i) {
        studentPlot.addDataset(new Plottable.Dataset(
            student_overview.map(d => d.length[i].value)
        ).metadata(i)
        );
    }
    studentPlot.x((d, i) => i, xScale)
        .y(d => d, yScale)
        .attr("fill", (d, i, dataset) => {
            return colorSchema[dataset.metadata()];
        });

    var table = new Plottable.Components.Table([
        [yAxis, studentPlot],
        [null, xAxis],
    ]);
    return table;
}

function videoOverviewRender2(data, context) {
    const video_activies = data.video_activies;
    console.log(video_activies, context.current_chapter);
    if (!video_activies) return null;

    var xScale = new Plottable.Scales.Category();
    var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
    xAxis.formatter(d => video_activies[d].name);

    var watchTimeScale = new Plottable.Scales.Linear();
    var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
    var watchTimePlot = new Plottable.Plots.Bar()
        .y(d => d.video_watch_time, watchTimeScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[0])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var durationScale = new Plottable.Scales.Linear();
    var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
    durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)
    var durationPlot = new Plottable.Plots.Bar()
        .y(d => d.modified - d.created, durationScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[1])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptScale = new Plottable.Scales.Linear();
    var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
    var attemptPlot = new Plottable.Plots.Bar()
        .y(d => d.attempts, attemptScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[2])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var delayScale = new Plottable.Scales.Linear();
    var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
        .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
    var delayPlot = new Plottable.Plots.Bar()
        .y(d => {
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - (context.item_map[d.id] && context.item_map[d.id].chapter_start);
        }, delayScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[4])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptAxisLable = new Plottable.Components.AxisLabel("times", "0");
    var attemptPlotLable = new Plottable.Components.AxisLabel("video view times", "0");

    var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
    var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the video", "0");

    var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
    var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

    var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
    var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

    var table = new Plottable.Components.Table([
        [attemptAxisLable, attemptPlotLable],
        [attemptAxis, attemptPlot],
        [watchTimeLabel, watchTimePlotLabel],
        [watchTimeAxis, watchTimePlot],
        [null, xAxis]
    ]);
    return table;
}

export function videoOverviewRender3(data, context) {
    const video_activies = data.video_activies;
    if (!video_activies) return null;

    var xScale = new Plottable.Scales.Category();
    var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");
    xAxis.formatter(d => video_activies[d].name);

    var watchTimeScale = new Plottable.Scales.Linear();
    var watchTimeAxis = new Plottable.Axes.Numeric(watchTimeScale, "left").xAlignment("left");
    var watchTimePlot = new Plottable.Plots.Bar()
        .y(d => d.video_watch_time, watchTimeScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[0])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var durationScale = new Plottable.Scales.Linear();
    var durationAxis = new Plottable.Axes.Numeric(durationScale, "left").xAlignment("left");
    durationAxis.formatter(d => `${Number(d / 1000 / 3600).toFixed(1)}`)
    var durationPlot = new Plottable.Plots.Bar()
        .y(d => d.modified - d.created, durationScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[1])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptScale = new Plottable.Scales.Linear();
    var attemptAxis = new Plottable.Axes.Numeric(attemptScale, "left").xAlignment("left");
    var attemptPlot = new Plottable.Plots.Bar()
        .y(d => d.attempts, attemptScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[2])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var delayScale = new Plottable.Scales.Linear();
    var delayAxis = new Plottable.Axes.Numeric(delayScale, "left").xAlignment("left")
        .formatter(d => `${Number(d / 1000 / 3600 / 24).toFixed(1)}`);
    var delayPlot = new Plottable.Plots.Bar()
        .y(d => {
            console.log(d.created, (context.item_map[d.id] && context.item_map[d.id].chapter_start));
            return d.created - (context.item_map[d.id] && context.item_map[d.id].chapter_start);
        }, delayScale)
        .x((d, i) => i, xScale)
        .attr("stroke", "none")
        .attr("fill", colorSchema[4])
        .animated(true)
        .addDataset(new Plottable.Dataset(video_activies));

    var attemptAxisLable = new Plottable.Components.AxisLabel("times", "0");
    var attemptPlotLable = new Plottable.Components.AxisLabel("video view times", "0");

    var durationAxisLable = new Plottable.Components.AxisLabel("Duration (Hours)", "0");
    var durationPlotLable = new Plottable.Components.AxisLabel("The time spend on the video", "0");

    var watchTimeLabel = new Plottable.Components.AxisLabel("minutes", "0");
    var watchTimePlotLabel = new Plottable.Components.AxisLabel("video watch time", "0");

    var delayAxisLable = new Plottable.Components.AxisLabel("Delay (Days)", "0");
    var delayPlotLable = new Plottable.Components.AxisLabel("The start time after the problem released", "0");

    var table = new Plottable.Components.Table([
        [delayAxisLable, delayPlotLable],
        [delayAxis, delayPlot],
        [durationAxisLable, durationPlotLable],
        [durationAxis, durationPlot],
        [null, xAxis]
    ]);
    return table;
}
