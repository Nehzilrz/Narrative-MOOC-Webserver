<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <b-form-row style="padding-top: 5vh">
                <b-col cols="1">
                </b-col>
                <b-col cols="4">
                    <div class="slideshow-content graph" style="height: 50vh">
                    </div>
                </b-col>
            </b-form-row>
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
            useless() {
                /*
                data.education_highest_name = education_data[0].name;
                data.education_highest_val = Number(education_data[0].val / education_data_sum * 100).toFixed(1) + '%';

                data.gender_highest_name = gender_data[0].name;
                data.gender_highest_val = Number(gender_data[0].val / gender_data_sum * 100).toFixed(1) + '%';
*/
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
                const user_info = data.user_info;
                const users = user_info.users;

                var edu_scale = new Plottable.Scales.Linear();
                var edu_color_scale = new Plottable.Scales.Color();
                edu_color_scale.range(context.color_schema);

                var edu_plot = new Plottable.Plots.Pie()
                    .addDataset(new Plottable.Dataset(user_info.education))
                    .sectorValue(d => d.val.length, edu_scale)
                    .attr("fill", d => d.name, edu_color_scale)
                    .animated(true)
                    .labelsEnabled(true)
                    .labelFormatter((d) => Number(d / users.length * 100).toFixed(1) + '%');

                var edu_legend = new Plottable.Components.Legend(edu_color_scale);
                edu_legend.maxEntriesPerRow(1);
                edu_legend
                    .symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("right");

                var gender_scale = new Plottable.Scales.Linear();
                var gender_color_scale = new Plottable.Scales.Color();
                gender_color_scale.range(context.color_schema);

                var gender_plot = new Plottable.Plots.Pie()
                    .addDataset(new Plottable.Dataset(user_info.gender))
                    .sectorValue(d => d.val.length, gender_scale)
                    .attr("fill", d => d.name, gender_color_scale)
                    .animated(true)
                    .labelsEnabled(true)
                    .labelFormatter((d) => Number(d / users.length * 100).toFixed(1) + '%');
                
                var gender_legend = new Plottable.Components.Legend(gender_color_scale);
                gender_legend.maxEntriesPerRow(1);
                gender_legend
                    .symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("right");

                var age_scale = new Plottable.Scales.Linear();
                var age_color_scale = new Plottable.Scales.Color();
                age_color_scale.range(context.color_schema);

                var age_plot = new Plottable.Plots.Pie()
                    .addDataset(new Plottable.Dataset(user_info.age))
                    .sectorValue(d => d.val.length, age_scale)
                    .attr("fill", d => d.name, age_color_scale)
                    .animated(true)
                    .labelsEnabled(true)
                    .labelFormatter((d) => Number(d / users.length * 100).toFixed(1) + '%');
                
                var age_legend = new Plottable.Components.Legend(age_color_scale);
                age_legend.maxEntriesPerRow(1);
                age_legend
                    .symbol(() => Plottable.SymbolFactories.circle())
                    .xAlignment("right");

                var table = new Plottable.Components.Table([
                    [edu_legend, edu_plot],
                    [gender_legend, gender_plot],
                    [age_legend, age_plot],
                ]);
                return table;
            },
        },
        props: ["item", "context", "step"],
    };
</script>

<style scope>
.slideshow-content.text h6 {
    font-weight: 600;
}
</style>