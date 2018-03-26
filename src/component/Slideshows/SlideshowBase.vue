<script>
import Plottable from "plottable";

export default {
    data() {
        return {
            last_element: null,
            tables: [],
            plots: [],
        };
    },
    created() {
        this.$bus.$on("refresh-chart", this.refreshChart);
    },
    updated() {
        console.log('updated');
        var elements = this.$el.getElementsByClassName('graph');
        for (let i = 0; i < elements.length && i < this.tables.length; ++i) {
            this.tables[i].renderTo(elements[i]);
        }
    },
    mounted() {
        var elements = this.$el.getElementsByClassName('graph');
        for (let i = 0; i < elements.length && i < this.tables.length; ++i) {
            this.tables[i].renderTo(elements[i]);
        }
    },
    destroyed() {
        this.$bus.$off("refresh-chart", this.refreshChart);
    },
    methods: {
        refreshChart(element_id) {
            if (element_id == '') {
                for (const plot of this.plots) {
                    plot.attr("opacity", 1);
                }
            } else {
                for (const plot of this.plots) {
                    plot.attr("opacity", d => d.id == element_id ? 1 : 0.5);
                }
            }
        },
        showTooltip(message, position) {
            const event = {
                message,
                position,
                time: new Date(),
            };
            this.$emit('showtooltip', event);
        },
        attachMousemove(plots, message) {
            const interaction = new Plottable.Interactions.Pointer();
            message = message || (() => 'No Content');
            interaction.onPointerMove(point => {
                const element = plots.entitiesAt(point)[0];
                if (!element) return;
                const selection = element.selection;
                if (!selection) return;
                const x = selection.datum();
                this.showTooltip(message(x), {
                    x: point.x + plots.origin().x,
                    y: point.y + plots.origin().y,
                });
                if (!this.context.enable_highlight_chart) {
                    plots.selections().attr("opacity", 0.8);
                    selection.attr("opacity", 1);
                }
            }).onPointerExit(point => {
                if (!this.context.enable_highlight_chart) {
                    plots.selections().attr("opacity", 0.8);
                }
            });
            interaction.attachTo(plots);
        },
        attachClick(plots) {
            const interaction = new Plottable.Interactions.Click();
            interaction.onClick(point => {
                if (this.context.enable_highlight_chart) {
                    const element = plots.entitiesAt(point)[0];
                    if (!element) return;
                    if (this.last_element == element.datum.id) {
                        plots.selections().attr("opacity", 1);
                        this.last_element = null;
                        return;
                    } else {
                        plots.selections().attr("opacity", 0.5);
                    }
                    const selection = element.selection;
                    selection.attr("opacity", 1);
                    this.last_element = element.datum.id;
                } else {
                    const element = plots.entitiesAt(point)[0];
                    if (!element) return;
                    const selection = element.selection;
                    if (!selection) return;
                    let x = selection.datum();
                    x = this.$mapping[x.id];
                    if (x && x.type == 'video') {
                        this.$bus.$emit('select_video', x, this.item);
                    } else if (x && x.type == 'assignment') {
                        this.$bus.$emit('select_assignment', x, this.item);
                    }
                }
            });
            interaction.attachTo(plots);
        }
    },
    props: ["item", "data", "context"],
};
</script>
