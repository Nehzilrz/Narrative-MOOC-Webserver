<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slide nm-block title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slide nm-block" style="height: 25vh">
                <div class="graph nm-block" style="width: 50%; float: left;">
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
                <div class="text" style="width: 50%; float: left; padding-left: 2vw;
                    padding-top: 1vh;">
                    <div class="nm-block" style="padding-left: 2vw;">
                        <styled-text :context="context">
                            The assignment the student started at the latest was 
                            <entity-link :id="max_delay.id" :context="context" :parent="item"></entity-link>
                            , and they started it {{ Number(max_delay.delay).toFixed(1) }} days after the assignment was released.
                        </styled-text>
                    </div>
                    <div class="nm-block" style="padding-left: 2vw;">
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
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
            };
        },
        created() {
            this.tables.push(this.render(this.item.data, this.context));
        },
        extends: SlideshowBase,
        computed: {
            start_finish() {
                const assignment_activies = this.item.data.problem_activies;
                if (!assignment_activies) return [];
                const context = this.context;
                return assignment_activies.map(d => {
                    d.duration = (d.modified - d.created) / 86400000;
                    d.delay = (d.created - (context.item_mapping[d.id] && context.item_mapping[d.id].chapter_start)) / 86400000;
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

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) =>
                    `Delay: ${Number(x.delay).toFixed(1)} days, Duration: ${Number(x.duration).toFixed(1)} days`
                );

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
    };
</script>