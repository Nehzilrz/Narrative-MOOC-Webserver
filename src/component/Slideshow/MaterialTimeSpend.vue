<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content" style="height: 25vh;">
                <div class="graph" style="width: 50%; float: left;">
                </div>
                <div class="text" style="width: 50%; float: left;">
                    <h6> 
                        Time cost in this week:
                    </h6>
                    <styled-text :context="context" v-if="video_time > 0 || assignment_time > 0">
                        Students spend an average of {{ Number(video_time / 60).toFixed(1) }} minutes watching the video 
                            and {{ Number(assignment_time / 60).toFixed(1) }} minutes completing the assignment.
                    </styled-text>
                </div>
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
            this.context.bus.$on("add-text-box", this.handle);
        },
        destroyed() {
            this.context.bus.$off("add-text-box", this.handle);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
        },
        computed: {
            max_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, time: d.video_watch_time / 60 }))
                    .sort((a, b) => b.time - a.time)
                    .slice(0, 1);
            },
            min_video() {
                return this.item.data.video_activies.map(d => ({ name: d.name, id: d.id, time: d.video_watch_time / 60 }))
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 1);
            },
            max_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, time: d.work_time / 60 }))
                    .sort((a, b) => b.time - a.time)
                    .slice(0, 1);
            },
            min_assignment() {
                return this.item.data.problem_activies.map(d => ({ name: d.name, id: d.id, time: d.work_time / 60 }))
                    .sort((a, b) => a.time - b.time)
                    .slice(0, 1);
            },
            activies() {
                if (!this.item.data) return [];
                const video_activies = this.item.data.video_activies;
                const problem_activies = this.item.data.problem_activies;
                if (!video_activies && !problem_activies) return [];
                return video_activies.map(d => ({ id: d.id, name: d.name, val: d.video_watch_time, type: 'video' }))
                .concat(
                    problem_activies.map(d => ({ id: d.id, name: d.name, val: d.work_time, type: 'assignment' }))
                );
            },
            video_time() {
                return this.activies.filter(d => d.type == 'video').map(d => d.val).reduce((a, b) => a + b, 0);
            },
            assignment_time() {
                return this.activies.filter(d => d.type == 'assignment').map(d => d.val).reduce((a, b) => a + b, 0);
            },
            total_time() {                
                return this.activies.map(d => d.val).reduce((a, b) => a + b, 0);
            }
        },
        methods: {
            handle(_id) {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            },
            render(data, context) {
                const activies = this.activies;
                var color_scale = new Plottable.Scales.Color();
                color_scale.domain(['video', 'assignment']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                color_scale.range([data.video_color, data.assignment_color]);

/*
                var sum = activies.map(d => d.val).reduce((a, b) => a + b, 0);
                var plot = new Plottable.Plots.Pie()
                    .addDataset(new Plottable.Dataset(activies))
                    .sectorValue(d => d.val)
                    .attr("fill", d => d.type, color_scale)
                    .attr("opacity", 0.8)
                    .animated(true)
                    .labelsEnabled(true)
                    .labelFormatter((d) => Number(d / sum * 100).toFixed(1) + '%')
                    .outerRadius(80)
                    .attr("stroke", 'none');
                    */
                var sum = activies.map(d => d.val).reduce((a, b) => a + b, 0);
                var plots = new Plottable.Plots.Pie()
                    .addDataset(new Plottable.Dataset([
                        { type: 'video', val: this.video_time }, 
                        { type: 'assignment', val: this.assignment_time },
                    ]))
                    .sectorValue(d => d.val)
                    .attr("fill", d => d.type, color_scale)
                    .attr("opacity", 0.8)
                    .animated(true)
                    .labelsEnabled(true)
                    .labelFormatter((d) => Number(d / sum * 100).toFixed(1) + '%')
                    .outerRadius(80)
                    .attr("stroke", 'none');
                    
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
                        if (x.type == 'video') {
                            context.loadSlide('V1', this.item.resource_id, this.item);
                        } else if (x.type == 'assignment') {
                            context.loadSlide('A1', this.item.resource_id, this.item);
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
                
                var legend = new Plottable.Components.Legend(color_scale);
                legend.maxEntriesPerRow(1);
                legend.symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("right");
                    
                var table = new Plottable.Components.Table([
                    [legend, plots],
                ]);
                return table;
            },
            barChartRender(data, context) {
                const video_activies = data.video_activies;
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video', 'assignment']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color, data.assignment_color]);

                var timeCostScale = new Plottable.Scales.Linear();
                var timeAxis = new Plottable.Axes.Numeric(timeCostScale, "left").xAlignment("left");
                
                var plot = new Plottable.Plots.Bar()
                    .y((d, i, dataset) => dataset.metadata() == 'video' ?
                        d.video_watch_time : d.work_time, timeCostScale
                    )
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(video_activies).metadata('video'))
                    .addDataset(new Plottable.Dataset(problem_activies).metadata('assignment'));

                var timeAxisLable = new Plottable.Components.AxisLabel("time-cost", "0");
                var plotLable = new Plottable.Components.AxisLabel("", "0");

                var table = new Plottable.Components.Table([
                    [timeAxisLable, null],
                    [timeAxis, plot],
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