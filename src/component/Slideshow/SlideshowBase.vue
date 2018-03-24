<script>
export default {
    data() {
        return {
            show_tooltip: false,
            tooltip_message: 'Hello World',
            current_point: {},
            last_element: null,
            table: null,
            plots: null,
        };
    },
    created() {
        this.context.addtext_bus.$on("add-textbox", this.handle);
        this.context.refreshchart_bus.$on("refresh-chart", this.refreshChart);
    },
    destroyed() {
        this.context.addtext_bus.$off("add-textbox", this.handle);
        this.context.refreshchart_bus.$off("refresh-chart", this.refreshChart);
    },
    methods: {
        refreshChart(element_id) {
            if (element_id == '') {                
                this.plots && this.plots.attr("opacity", 1);
            } else {               
                this.plots && this.plots.attr("opacity", d => d.id == element_id ? 1 : 0.5);
            }
        },
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
    },
    props: ["item", "context"],
};
</script>
