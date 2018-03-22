<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content" style="height: 25vh">
                <div class="graph" style="width: 50%; float: left;">
                </div>
                <div class="text" style="width: 50%; float: left; padding-left: 2vw;
                    padding-top: 1vh;">
                    <h6> 
                        Time cost in this week:
                    </h6>
                    <div style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment the student started at the latest was 
                            <entity-link :id="max_delay.id" :context="context" :parent="item"></entity-link>
                            , and they started it {{ Number(max_delay.delay).toFixed(1) }} days after the assignment was released.
                        </styled-text>
                        <styled-text :context="context">
                            The longest assignment for the student working cycle is <entity-link :id="max_duration.id" :context="context" :parent="item"></entity-link>.
                                {{ Number(max_duration.duration).toFixed(1) }} days.
                        </styled-text>
                    </div>
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
                show_tooltip: false,
                tooltip_message: 'Hello World',
                current_point: {},
                table: null,
                lastElement: null,
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
            start_finish() {
                const assignment_activies = this.item.data.problem_activies;
                if (!assignment_activies) return [];
                const context = this.context;
                return assignment_activies.map(d => {
                    d.duration = (d.modified - d.created) / 86400000;
                    d.delay = (d.created - (context.id2item[d.id] && context.id2item[d.id].chapter_start)) / 86400000;
                    return {
                        duration: d.duration,
                        delay: d.delay,
                        name: d.name,
                        id: d.id,
                        type: 'assignment',
                    }
                });
            },
            max_duration() {
                if (this.start_finish.length == 0) return null;
                const val = Math.max(...this.start_finish.map(d => d.duration));
                return this.start_finish.find(d => d.duration == val);
            },
            max_delay() {
                if (this.start_finish.length == 0) return null;
                const val = Math.max(...this.start_finish.map(d => d.delay));
                return this.start_finish.find(d => d.delay == val);
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
                const assignment_activies = this.start_finish;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['delay', 'duration']);
                colorScale.range([context.color_schema[3], context.color_schema[2]]);

                var timeScale = new Plottable.Scales.Linear();
                var timeAxis = new Plottable.Axes.Numeric(timeScale, "left").xAlignment("left");
                timeAxis.formatter((d) => `${Number(d).toFixed(1)}`)
                var plots = new Plottable.Plots.StackedBar()
                    .y((d, i, dataset) => 
                        dataset.metadata() == 'delay' ?
                        d.delay : d.duration, timeScale
                    )
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .animated(true)
                    .addDataset(new Plottable.Dataset(assignment_activies).metadata('delay'))
                    .addDataset(new Plottable.Dataset(assignment_activies).metadata('duration'));

                if (this.lastElement) {
                    plots.attr("opacity", d => d.id == this.lastElement ? 1 : 0.5);
                }
                
                var interaction = new Plottable.Interactions.Click();
                interaction.onClick(point => {
                    if (this.context.enable_highlight_chart) {
                        var element = plots.entitiesAt(point)[0];
                        if (!element) return;
                        if (this.lastElement == element.datum.id) {
                            plots.selections().attr("opacity", 1);
                            this.lastElement = null;
                            return;
                        } else {
                            plots.selections().attr("opacity", 0.5);
                        }
                        var selection = element.selection;
                        selection.attr("opacity", 1);
                        this.lastElement = element.datum.id;
                    } else {
                        var element = plots.entitiesAt(point)[0];
                        if (!element) return;
                        var selection = element.selection;
                        if (!selection) return;
                        var x = selection.datum();
                        x = context.id2item[x.id];
                        if (x.type == 'video') {
                            context.selectVideo(x, this.item);
                        } else if (x.type == 'assignment') {
                            context.selectAssignment(x, this.item);
                        }
                    }
                });
                interaction.attachTo(plots);
                var interaction2 = new Plottable.Interactions.Pointer();
                interaction2.onPointerMove(point => {
                    var element = plots.entitiesAt(point)[0];
                    if (!element) {
                        this.show_tooltip = false;
                        return;
                    }
                    var selection = element.selection;
                    if (!selection) return;
                    this.show_tooltip = true;
                    this.current_point.x = point.x + plots.origin().x;
                    this.current_point.y = point.y + plots.origin().y;
                    var x = selection.datum();
                    this.tooltip_message = `value: ${x.activeness}`;
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                        selection.attr("opacity", 1);
                    }
                }).onPointerExit(point => {
                    this.show_tooltip = false;
                    if (!this.context.enable_highlight_chart) {
                        plots.selections().attr("opacity", 0.8);
                    }
                });
                interaction2.attachTo(plots);

                var timeLabel = new Plottable.Components.AxisLabel("Days", "0");
                var plotsLabel = new Plottable.Components.AxisLabel("days", "0");
                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(2);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

                var table = new Plottable.Components.Table([
                    [timeLabel, legend],
                    [timeAxis, plots],
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