<template>
    <div class="slide-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slide nm-block nm-block title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slide nm-block" style="height: 25vh;">
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
                <div class="text nm-block" style="width: 50%; float: left;">
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
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
            };
        },
        extends: SlideshowBase,
        created() {
            this.tables.push(this.render(this.item.data, this.context));
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
                    
                this.plots.push(plots);
                this.attachClick(plots);
                this.attachMousemove(plots, (x) => `value: ${x.val}`);
                
                var legend = new Plottable.Components.Legend(color_scale);
                legend.maxEntriesPerRow(1);
                legend.symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("right");
                    
                var table = new Plottable.Components.Table([
                    [legend, plots],
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