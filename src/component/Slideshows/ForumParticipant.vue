<template>
<div>
    <div class="b4w b5h nm-block graph">
    </div>
    <div class="b4w bh nm-block text">
        <styled-text :context="context">
            <b-link @click="addgroup(questioners, 'Questioners')">{{ questioners.length }} learners</b-link> posted their topic in the forum this week.
        </styled-text>
    </div>
    <div class="b4w bh nm-block text">
        <styled-text :context="context">
            <b-link @click="addgroup(responders, 'Responders')">{{ responders.length }} learners</b-link>
             replied some topic in the forum this week.
        </styled-text>
    </div>
</div>
</template>

<script>
    import SlideshowBase from "./SlideshowBase.vue";
    import Plottable from "plottable";
    import { color_schema } from "../../lib/colors";

    export default {
        data() {
            return {
            };
        },
        extends: SlideshowBase,
        created() {
            this.tables.push(this.render(this.data, this.context));
        },
        computed: {
            questioners() {
                return [].concat(...this.data.threads.questioners_count.map(d => d.users));
            },
            responders() {
                return [].concat(...this.data.threads.responders_count.map(d => d.users));
            },
        },
        methods: {
            addgroup(group, group_name) {
                this.context.options.push(   
                    { name: group_name, 
                        value: () => ({ key: 'user_id', rule: { $in: group }}),
                    });
            },
            render(data, context) {
                const questioners = data.threads.questioners_count;
                const responders = data.threads.responders_count;

                var xScale = new Plottable.Scales.Category();
                var xAxis = new Plottable.Axes.Category(xScale, "bottom").yAlignment("bottom");

                var colorScale = new Plottable.Scales.Color();
                colorScale.domain(['questioner', 'responder']);
                colorScale.range([color_schema[7], color_schema[6]]);

                var activenessScale = new Plottable.Scales.ModifiedLog();
                var activenessAxis = new Plottable.Axes.Numeric(activenessScale, "left").xAlignment("left");
                var plots = new Plottable.Plots.Bar()
                    .y(d => d.val, activenessScale)
                    .x(d => d.name, xScale)
                    .attr("stroke", "none")
                    .attr("fill", (d, i, dataset) => dataset.metadata(), colorScale)
                    .attr("opacity", 0.8)
                    .addDataset(new Plottable.Dataset(questioners).metadata('questioner'))
                    .addDataset(new Plottable.Dataset(responders).metadata('responder'));

                var legend = new Plottable.Components.Legend(colorScale);
                    legend.maxEntriesPerRow(1);
                    legend
                        .symbol(() => Plottable.SymbolFactories.circle())
                        .xAlignment("right");

                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${x.val}`);

                var yLabel = new Plottable.Components.AxisLabel("Peoples", "0");

                var table = new Plottable.Components.Table([
                    [yLabel, legend],
                    [activenessAxis, plots],
                    [null, xAxis]
                ]);

                return table;
            },
        },
    };
</script>

<style scope>
</style>