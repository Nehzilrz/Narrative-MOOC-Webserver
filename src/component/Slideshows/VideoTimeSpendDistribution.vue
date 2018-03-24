<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slide nm-block title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slide nm-block graph" style="height: 40vh">
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
            <div class="slide nm-block text" v-for="student, i in students">
                <styled-text :context="context">
                    {{ student.name }} students pay more attention on these video, which including
                    <entity-link :id="student.videos[0].id" :context="context" :parent="item"></entity-link>
                    and
                    <entity-link :id="student.videos[1].id" :context="context" :parent="item"></entity-link>
                    .
                </styled-text>
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
                show_tooltip: false,
                tooltip_message: 'Hello World',
                current_point: {},
                table: null,
                lastElement: null,
            };
        },
        extends: SlideshowBase,
        created() {
            this.table = this.render(this.item.data, this.context);
        },
        mounted() {
            var element = this.$el.getElementsByClassName('graph')[0];
            this.table.renderTo(element);
        },
        computed: {
            overview() {
                return this.item.data.student_overview
                    .filter((d) => this.context.item_mapping[d.id])
                    .sort((a, b) => b.length[3].value - a.length[3].value);
            },
            students() {
                return this.overview[0].length.map((e, i) => {
                    var name = e.name;
                    if (name.includes('the'))
                        name = name.replace('the', 'The');
                    else
                        name = 'The ' + name;
                    return {
                        name: name,
                        videos: this.overview.map(d => ({
                            id: this.context.item_mapping[d.id].id,
                            value: d.length[i].value
                        })).sort((a, b) => b.value - a.value).slice(0, 2),
                    }
                });
            }
        },
        methods: {
            render(data, context) {
                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom");

                var yScale = new Plottable.Scales.Linear();
                var yAxis = new Plottable.Axes.Numeric(yScale, "left");

                var studentPlot = new Plottable.Plots.ClusteredBar();
                var colorScale = new Plottable.Scales.Color();
                colorScale.range(context.color_schema.slice(0, 4));

                data.students = [];
                const overview = this.overview;
                for (var i = 3; i >= 0; --i) {
                    studentPlot.addDataset(new Plottable.Dataset(
                            overview.map(d => ({
                                id: context.item_mapping[d.id].name,
                                value: d.length[i].value
                            }))
                        ).metadata(overview[0].length[i].name)
                    );
                }

                studentPlot.x(d => d.id, xScale)
                    .y(d => d.value, yScale)
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
            },
        },
    };
</script>

<style scope>
.slide.text h6 {
    font-weight: 600;
}
</style>