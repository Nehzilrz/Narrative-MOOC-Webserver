<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content graph" style="height: 40vh">
            </div>
            <div class="slideshow-content text">
                <h6> 
                    Activies in this week:
                </h6>
                <ul>
                    <li v-if="max_video_activies">
                        <styled-text :context="context">
                            The most visited video was 
                            <entity-link :id="max_video_activies.id" :context="context" :parent="item"></entity-link>
                            , {{ max_video_activies.activeness }} 
                            students visited the video.
                        </styled-text>
                    </li>
                    <li v-if="min_video_activies">
                        <styled-text :context="context">
                        The least visited video was 
                        <entity-link :id="min_video_activies.id" :context="context" :parent="item"></entity-link>
                        , {{ min_video_activies.activeness }} 
                        students visited the video.
                        </styled-text>
                    </li>
                    <li v-if="max_assignment_activies">
                        <styled-text :context="context">
                        The most visited assignment was 
                        <entity-link :id="max_assignment_activies.id" :context="context" :parent="item"></entity-link>
                        , {{ max_assignment_activies.activeness }} 
                        students visited the assignment.
                        </styled-text>
                    </li>
                    <li v-if="min_assignment_activies">
                        <styled-text :context="context">
                        The least visited assignment was 
                        <entity-link :id="min_assignment_activies.id" :context="context" :parent="item"></entity-link>
                        , {{ min_assignment_activies.activeness }} 
                        students visited the assignment.
                        </styled-text>
                    </li>
                </ul>
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
        components: {
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
            max_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.max(...video_activies.map(d => d.activeness));
                return video_activies.find(d => d.activeness == t);
            },
            min_video_activies() {
                const video_activies = this.item.data.video_activies;
                const t = Math.min(...video_activies.map(d => d.activeness));
                return video_activies.find(d => d.activeness == t);
            },
            max_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.max(...problem_activies.map(d => d.activeness));
                return problem_activies.find(d => d.activeness == t);
            },
            min_assignment_activies() {
                const problem_activies = this.item.data.problem_activies;
                const t = Math.min(...problem_activies.map(d => d.activeness));
                return problem_activies.find(d => d.activeness == t);
            },
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
                const video_activies = data.video_activies;
                const problem_activies = data.problem_activies;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['video', 'assignment']);
                data.video_color = context.video_color;
                data.assignment_color = context.assignment_color;
                colorScale.range([data.video_color, data.assignment_color]);

                var activenessScale = new Plottable.Scales.Linear();
                var activenessAxis = new Plottable.Axes.Numeric(activenessScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
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

                var yLabel = new Plottable.Components.AxisLabel("Popularity", "0");

                var table = new Plottable.Components.Table([
                    [yLabel, legend],
                    [activenessAxis, plots],
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