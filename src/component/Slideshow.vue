<template>
  <div class="slideshow-outbox">
    <div class="slideshow-content">
    </div>
  </div>
</template>

<script>
import Plottable from "plottable";
import d3 from "d3";

function sum(vec) {
  var ret = 0;
  for (var i = 0; i < vec.length; ++i) {
    ret += vec[i];
  }
  return ret;
}

export default {
  data() {
    return {};
  },
  props: ["logdata", "entropyRange"],
  watch: {
    logdata(data) {
      const entropyDeltaThreshold = 0.3;
      const topEntropyDeltaNum = 3;

      var xScale = new Plottable.Scales.Linear();
      var yScale = new Plottable.Scales.Linear();
      var scoreScale = new Plottable.Scales.Linear();
      var colorScale = new Plottable.Scales.Color();
      colorScale.domain(Object.keys(data.logs));
      colorScale.range(["#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);
      scoreScale.domain([0, 100]);
      var areaPlot = new Plottable.Plots.StackedArea();
      var dColorScale = new Plottable.Scales.Color();
      var colorCategory10 = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];
      dColorScale.range(colorCategory10);

      var duration = 0;
      for (const action in data.logs) {
        areaPlot.addDataset(
          new Plottable.Dataset(data.logs[action]).metadata(action)
        );
        if (data.logs[action].length > duration) {
          duration = data.logs[action].length;
        }
      }

      xScale.domain([0, duration + 1]);

      const peaks = this.logdata.peaks;

      var entropyScale = new Plottable.Scales.InterpolatedColor();
      entropyScale.range(["#dbdde0", "#385fae"]);
      var entropyLegend = new Plottable.Components.InterpolatedColorLegend(
        entropyScale
      ).xAlignment("right");
      entropyScale.domain([this.entropyRange[0], this.entropyRange[1]]);

      var peakPlot = new Plottable.Plots.Bar()
        .x(d => (d.start + d.end) / 2, xScale)
        .y(d => d.avgGrade, scoreScale)
        .attr("width", d => (d.end - d.start + 2))
        .attr("fill", d => d.entropyDelta, entropyScale)
        .attr("opacity", 0.6)
        .addDataset(new Plottable.Dataset(peaks));

      var peakCirclePlot = new Plottable.Plots.Scatter()
        .x(d => (d.start + d.end) / 2, xScale)
        .y(d => d.avgGrade, scoreScale)
        .attr("stroke-width", 1.5)
        .attr("stroke", d => {
          if (d.index < topEntropyDeltaNum && d.entropyDelta > entropyDeltaThreshold) {
            return dColorScale.scale(d.index + 1);
          } else {
            return '#385fae';
          }
        })
        .size(10)
        .attr("opacity", d => {
          if (d.index < topEntropyDeltaNum && d.entropyDelta > entropyDeltaThreshold) {
            return 0.9;
          } else {
            return 0.2;
          }
        })
        .attr("fill", d => {
          if (d.index < topEntropyDeltaNum && d.entropyDelta > entropyDeltaThreshold) {
            return dColorScale.scale(d.index + 1);
          } else {
            return entropyScale.scale(d.entropyDelta);
          }
        })
        .addDataset(new Plottable.Dataset(peaks));

      var xAxis = new Plottable.Axes.Numeric(xScale, "bottom")
        .yAlignment("bottom")
        .formatter(
          d => "" + ~~(d / 60) + ":" + (d % 60 < 10 ? "0" : "") + d % 60
        );
      var yAxis = new Plottable.Axes.Numeric(yScale, "left");
      var scoreAxis = new Plottable.Axes.Numeric(
        scoreScale,
        "right"
      ).xAlignment("right");

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
      zScale.tickGenerator(() => [this.logdata.info.avgGrade]);
      var gridlines = new Plottable.Components.Gridlines(xScale, zScale);

      var zLabel = new Plottable.Axes.Numeric(zScale, "left").formatter(
        () => "AVERAGE SCORE"
      );
      var plots = new Plottable.Components.Group([
        peakPlot,
        areaPlot,
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
      distributionAxis.formatter((d) => d * 100 + '%');
      var distributionPlot = new Plottable.Plots.ClusteredBar();
      const overallSum = sum(this.logdata.info.gradeDistribution);
      distributionPlot.addDataset(
        new Plottable.Dataset(
          this.logdata.info.gradeDistribution.map(d => d / overallSum)
        ).metadata(0)
      );
      for (var i = 0; i < peaks.length && i < topEntropyDeltaNum; ++i) {
        if (peaks[i].entropyDelta < entropyDeltaThreshold) {
          break;
        }
        const currentSum = sum(peaks[i].gradeDistribution);
        distributionPlot.addDataset(
          new Plottable.Dataset(
            peaks[i].gradeDistribution.map(d => d / currentSum)
          ).metadata(i + 1)
        );
      }

      distributionPlot
        .x((d, i) => i, scoreCategoryScale)
        .y(d => d, distributionScale)
        .attr("fill", (d, i, dataset) => dataset.metadata(), dColorScale);

      var dLegend = new Plottable.Components.Legend(dColorScale);
      dLegend.maxEntriesPerRow(5)
      dLegend
        .symbol(() => Plottable.SymbolFactories.circle())
        .xAlignment("center")
        .formatter((d) => {
          if (d == 0) {
            return "overall";
          } else {
            const t = peaks[d - 1];
            return '' + t.action + ' peak at ' + (t.start + t.end) / 2 + 's';
          }
        });

      var scoreCategoryAxis = new Plottable.Axes.Category(scoreCategoryScale, "bottom");
      scoreCategoryAxis.formatter((d) => `${d*10}-${(d+1)*10}`);

      const distributionGroup = new Plottable.Components.Group([distributionPlot, dLegend]);

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