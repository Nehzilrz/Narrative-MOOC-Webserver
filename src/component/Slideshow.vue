<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  
      <b-navbar-brand href="#">Narrative MOOC</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <!--
      <b-nav-item active><h5>Narrative MOOC</h5><hr/>Dashboard</b-nav-item>
      <b-nav-item><h5>01</h5><hr/>Assumed Pattern</b-nav-item>
      <b-nav-item><h5>02</h5><hr/>Uncertain Pattern</b-nav-item>
      <b-nav-item><h5>03</h5><hr/>Conclusion</b-nav-item>-->


        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown :text="`Video: ${current_video && current_video.name}`" right>
            <b-dropdown-item v-for="video in videos" @click="videoDropdownClick(video)">
              {{video.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="`Problem: ${current_problem && current_problem.name}`" right>
            <b-dropdown-item v-for="problem in problems" @click="problemDropdownClick(problem)">
              {{problem.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown :text="`Chapter: ${current_chapter && current_chapter.name}`" right>
            <b-dropdown-item v-for="chapter in chapters" @click="chapterDropdownClick(chapter)">
              {{chapter.name}}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <b-form-row>
        <b-col cols="10">
          <div class="slideshow-container">
            <slideshow :context="this.context" :slide="this.slide" :index="this.slide_index">
            </slideshow>
          </div>
          <div class="thumbnail-container">
            <div v-for="item in slides" class="thumbnail" @click="onThumbnailClick(item)" :class="{ active: item == slide }">
              <div class="thumbnail-text">
                {{`${item.name}`}}
              </div>
            </div>
          </div>
        </b-col>
        <b-col class="bd-sidebar">
          <b-card bg-variant="dark" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.accordion1 variant="dark">Notes</b-btn>
            </b-card-header>
            <b-collapse id="accordion1" visible accordion="my-accordion" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                  The current video is {{ current_video }}
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card bg-variant="secondary" no-body class="mb-1">
            <b-card-header header-tag="header" class="p-1" role="tab">
              <b-btn block href="#" v-b-toggle.accordion2 variant="secondary">Mark Tools</b-btn>
            </b-card-header>
            <b-collapse id="accordion2" visible accordion="my-accordion2" role="tabpanel">
              <b-card-body>
                <p class="card-text">
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>
        </b-col>
      </b-form-row>
    </b-container>
  </div>
</template>

<script>
  import slideshow from "./component/Slideshow.vue";
  import axios from 'axios'

  const serverUrl = 'http://localhost:3000/';
  const courseId = 'HKUSTx_COMP102x_2T2014';
  const maxPeakNum = 15;

  export default {
    name: 'app',
    data() {
      return {
        text: `
                      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                      richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
                      brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
                      tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
                      assumenda shoreditch et. Nihil ani
                    `,
        slides: [],
        slide: null,
        videos: [],
        problems: [],
        chapters: [],
        logs: [],
        users: [],
        current_video: null,
        current_problem: null,
        current_chapter: null,
        slide_index: 0,
      }
    },
    components: {
      slideshow,
    },
    mounted() {
      axios.get(`${serverUrl}getVideoList`, { params: { courseId: courseId } }).then((response) => {
        this.videos = response.data;
        this.slides.push({
          name: 'Peaks in a Video',
          type: 'video_peaks',
          data: ['video_peaks', 'video_logs'],
        });
      }).then(() => {
        axios.get(`${serverUrl}getProblemList`, { params: { courseId: courseId } }).then((response) => {
          this.problems = response.data;
          this.slides.push({
            name: 'Activies in a Problem',
            type: 'problem_activies',
            data: ['problem_activies'],
          });
          this.slides.push({
            name: 'Attempts in a Problem',
            type: 'problem_attempts',
            data: ['problem_activies'],
          });
        });
      }).then(() => {
        axios.get(`${serverUrl}getChapterList`, { params: { courseId: courseId } }).then((response) => {
          this.chapters = response.data;
          return;
          this.slides.push({
            name: 'Problem Overview in a Chapter',
            type: 'problem_overview',
            data: [],
          });
          this.slides.push({
            name: 'Video overview in a Chapter',
            type: 'video_overview',
            data: [],
          });
        });
      });
    },
    computed: {
      context() {
        return {
          current_video: this.current_video,
          current_chapter: this.current_chapter,
          current_problem: this.current_problem,
          videos: this.videos,
          chapters: this.chapters,
          problems: this.problems,
        }
      },
    },
    methods: {
      onThumbnailClick(item) {
        Promise.all(item.data.map((type) => {
          if (type == 'video_peaks' && this.current_video && !this.current_video.video_peaks) {
            return axios.get(`${serverUrl}getVideoPeaks`, { params: { videoId: this.current_video.id } }).then((response) => {
              this.current_video.video_peaks = response.data;
            });
          } else if (type == 'video_logs' && this.current_video && !this.current_video.video_logs) {
            return axios.get(`${serverUrl}getVideoLogs`, { params: { videoId: this.current_video.id } }).then((response) => {
              this.current_video.video_logs = response.data;
            });
          } else if (type == 'problem_activies' && this.current_problem && !this.current_problem.problem_activies) {
            return axios.get(`${serverUrl}getProblemActivies`, { params: { id: this.current_problem.id } }).then((response) => {
              this.current_problem.activies = response.data;
              console.log(this.current_problem.id, response.data);
            });
          } else {
            return '';
          }
        })).then(() => {
          this.slide = item;
          this.slide_index += 1;
        });
      },
      videoDropdownClick(video) {
        this.current_video = video;
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
      problemDropdownClick(problem) {
        this.current_problem = problem;
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
      chapterDropdownClick(chapter) {
        this.current_chapter = chapter;
        if (this.slide) {
          this.onThumbnailClick(this.slide);
        }
      },
    },
    watch: {
    }
  }
</script>

<style scope>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333333;
    max-height: 100%;
  }

  .bd-sidebar {
    overflow-y: hidden;
    max-height: 86.5vh;
    background: #f1f1f1;
  }

  hr {
    height: 6px;
    border: 0;
    box-shadow: inset 0 2px 2px -2px rgba(0, 0, 0, 0.5);
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  .thumbnail {
    height: 11vh;
    width: 11vw;
    margin: 2vh 1vw 2vh 1vw;
    box-sizing: border-box;
    display: inline-flex;
    text-align: center;
    box-shadow: 0.5px -0.5px 0.5px 0.5px rgb(203, 205, 202);
    background: rgb(243, 245, 242);
    white-space: normal;
    font-size: 14px;
    position: relative;
  }

  .thumbnail.active {
    background: rgb(249, 248, 246);
    box-shadow: 3px -3px 0.5px 0.5px rgb(152, 193, 192);
  }

  .thumbnail:hover {
    background: rgb(249, 248, 246);
  }

  .thumbnail-percentage {
    position: absolute;
    height: 100%;
    background: rgb(175, 201, 201);
    opacity: 0.5;
    z-index: 1;
  }

  .thumbnail:hover .thumbnail-percentage {
    opacity: 0.5;
  }

  .thumbnail-text {
    position: absolute;
    z-index: 0;
  }

  .thumbnail-container {
    height: 15.5vh;
    max-width: 100%;
    z-index: 1;
    padding-top: 2px;
    top: 2px;
    display: inline-block;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    background: rgb(233, 234, 236);
  }

  .slideshow-container {
    height: 70vh;
    width: 100%;
    display: inline-block;
    background: rgb(255, 255, 255);
    margin-top: 5px;
  }

  .bd-sidebar {
    margin-top: 5px;
    color: white;
  }
</style><template>
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
        colorScale.domain(Object.keys(video_logs));
        colorScale.range(["#bdd7e7", "#6baed6", "#3182bd", "#08519c"]);
        scoreScale.domain([0, 100]);
        var areaPlot = new Plottable.Plots.StackedArea();
        var dColorScale = new Plottable.Scales.Color();
        dColorScale.range(colorSchema);

        var duration = video.duration;
        for (const action in video_logs) {
            areaPlot.addDataset(
                new Plottable.Dataset(video_logs[action]).metadata(action)
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
        zScale.tickGenerator(() => [video.average_grade * 100]);
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
        distributionAxis.formatter(d => d * 100 + "%");
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
            Math.min(...sample_activies.map(d => d.created)) - 3600 * 24,
            Math.min(
                Math.min(...sample_activies.map(d => d.created)) + 3600 * 24 * 14,
                Math.max(...sample_activies.map(d => d.created)) + 3600 * 24,
            )
        ]
        xScale.domain([range[0] * 1000, range[1] * 1000])
        sample_activies = sample_activies.filter(d => d.created >= range[0] && d.modified <= range[1]);

        var plots = new Plottable.Plots.Segment()
            .x(d => d.created * 1000, xScale)
            .y(10)
            .x2(d => d.modified * 1000, xScale)
            .y2(10)
            .attr("stroke", "none")
            .addDataset(new Plottable.Dataset(sample_activies));

        var table = new Plottable.Components.Table([[plots], [xAxis]]);
        table.renderTo(".slideshow-content");


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
                (xScale._d3Scale(d.modified * 1000) + xScale._d3Scale(d.created * 1000)) / 2}, 680) rotate(270)`)
            .attr("d", d => {
                var r =
                    (xScale._d3Scale(d.modified * 1000) - xScale._d3Scale(d.created * 1000)) / 2;
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
        console.log(problems);

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