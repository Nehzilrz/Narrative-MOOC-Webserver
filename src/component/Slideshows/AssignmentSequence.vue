<template>
<div>
    <div class="b4w bh nm-block sequence">
        <div class="graph nm-block" ref="graph">
            <svg></svg>
        </div>
        <div class="patterns">
            <div class="pattern nm-block">
                <span class="head">
                    Frequently watched videos
                </span>
                <span v-for="i in frequent" class="node" 
                    :class="{ active: current == i }"
                    @click="click(i)"
                    :style="{ 'background-color':
                    elements[i].type == 'video' ? context.color_schema[1] : context.color_schema[3]
                    }">
                    {{ i }}. {{ elements[i].name }}
                </span>
            </div>
            <div class="pattern infrequent nm-block">
                <span class="head">
                    Infrequently watched videos
                </span>
                <span v-for="i in infrequent" class="node" 
                    :class="{ active: current == i }"
                    @click="click(i)"
                    :style="{ 'background-color':
                    elements[i].type == 'video' ? context.color_schema[1] : context.color_schema[3]
                    }">
                    {{ i }}. {{ elements[i].name }}
                </span>
            </div>
        </div>
    </div>
    <div class="slide nm-block text">
        <styled-text :context="context" style="margin-left: 3vw;">
            The current assignment is {{ assignment.name }}, the weight of this assignment is {{ assignment.weight }}. 
            Assignment released on {{ assignment_release_date }}.
        </styled-text>
    </div>
    <div class="nm-block" ref="content">
    </div>
</div>
</template>

<script>
    import * as d3 from "d3";
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
                current: null,
            };
        },
        extends: SlideshowBase,
        created() {
            const table = () => {
                return {
                    renderTo: (el) => {
                        el.innerHTML = '';
                        const svg = d3.select(el).append('svg');
                        const element = el.getElementsByTagName('svg')[0];

                        const height = element.getBoundingClientRect().height;
                        const width = element.getBoundingClientRect().width;

                        const padding = 50;
                        const node_width = 14;
                        const node_height = 14;
                        const gap = (width - padding * 2) / (n - 1);

                        const data = this.elements;
                        const n = data.length;
                        const scalex = d3.scaleLinear()
                            .domain([data[0].time, data[n - 1].time])
                            .range([padding, width - padding]);


                        const scaleR = d3.scaleLinear()
                            .domain([Math.min(...data.map(d => d.val)), Math.max(...data.map(d => d.val))])
                            .range([14, 14]);


                        const x = data.map(d => scalex(d.time));
                        for (let i = n - 2; i >= 0; --i) {
                            if (x[i + 1] - x[i] < scaleR(data[i].val) * 1.2) {
                                x[i] = x[i + 1] - scaleR(data[i].val) * 1.2;
                            }
                        }

                        const x1 = (i) => x[~~(i / n)];
                        const x2 = (i) => x[(i % n)];
                        const radius = (i) => (x2(i) - x1(i)) * 0.4;
                        const y = height * 0.5;
                        const arc_data = [].concat(...this.adjacant);
                        const max_adjacant = Math.max(...arc_data);
                        const max_val = Math.max(...data.map(d => d.val));

                        svg.append("line")
                            .attr("x1", padding)
                            .attr("x2", width - padding)
                            .attr("y1", y)
                            .attr("y2", y)
                            .attr("stroke", "#cccccc");

                        var last = -1e10;
                        for (var i = 0; i < n; ++i)
                            if (x[i] - last > 100) {
                                svg.append("line")
                                    .attr("x1", x[i])
                                    .attr("x2", x[i])
                                    .attr("y1", y)
                                    .attr("y2", y + 20)
                                    .attr("stroke", "#cccccc");
                                
                                const date = new Date(data[i].time * 1000);
                                svg.append("text")
                                    .attr("x", x[i] - 30)
                                    .attr("y", y + 30)
                                    .text(date.toISOString().slice(5, 16).replace('T', ' '))
                                    .attr("color", "#333333")
                                    .attr("font-size", "10px");
                                last = x[i];
                            }

                        const arcs = svg.selectAll(".arc")
                            .data(arc_data)
                            .enter()
                            .append("path")
                            .attr("class", "arc")
                            .attr("d", (d, i) => {
                                return `M${x1(i)} ${y}
                                Q${(x1(i) + x2(i)) / 2} ${y - radius(i)}
                                ${x2(i)} ${y}`;
                            })
                            .attr("opacity", (d, i) => d / max_adjacant)
                            .attr("fill", "none")
                            .attr("stroke-width", 1)
                            .attr("stroke", "#1f78b4");
                        
                        const nodes = svg.selectAll(".node")
                            .data(this.elements)
                            .enter()
                            .append("g")
                            .attr("class", "node")
                            .attr("opacity", d => {
                                if (d.type == 'problem') {
                                    return 1;
                                } else {
                                    return (d.val / max_val) * (d.val / max_val);
                                }
                            })
                            .attr("transform", (d, i) => `translate(${x[i] - node_width / 2},${y - node_height / 2})`);

                        nodes.append("rect")
                            .attr("width", d => scaleR(d.val))
                            .attr("height", d => scaleR(d.val))
                            .style("stroke", (d, i) => {
                                return d.type == 'video' ? 
                                    this.context.color_schema[0] :
                                    this.context.color_schema[2];
                            })
                            .style("fill", d => d.type == 'video' ? 
                                this.context.color_schema[1] :
                                this.context.color_schema[3]
                            );
                        nodes.append("text")
                            .attr("dx", (d, i) => (d.type == 'problem' || i < 10) ?
                                scaleR(d.val) / 4 : 0)
                            .attr("dy", node_height - 2)
                            .attr("font-size", "12px")
                            .attr("fill", "white")
                            .text((d, i) => d.type == 'video' ? i : 1);
                    }
                }
            }
            this.tables.push(table());
        },
        mounted() {
            this.$refs.content.innerHTML = this.assignment.content;
        },
        computed: {
            assignment_release_date() {
                return new Date(this.assignment.chapter_start)
                    .toISOString().slice(0, 16).replace('T', ' ');
            },
            assignment() {
                return this.$mapping[this.item.resource_id];
            },
            sequence() {
                return this.data.sequence;
            },
            adjacant() {
                return this.sequence.adj;
            },
            elements() {
                return this.sequence.modules;
            },
            frequent() {
                return this.sequence.modules.slice(1, this.sequence.modules.length - 1)
                    .map((d, i) => ({ val: d.val, i: i }))
                    .sort((a, b) => b.val - a.val)
                    .slice(0, 4)
                    .map(d => d.i + 1)
                    .sort((a, b) => a - b);
            },
            infrequent() {
                return this.sequence.modules.slice(1, this.sequence.modules.length - 1)
                    .map((d, i) => ({ val: d.val, i: i }))
                    .sort((a, b) => b.val - a.val)
                    .slice(4)
                    .map(d => d.i + 1)
                    .sort((a, b) => a - b);
            },
            filtered_adj() {
                const adj = [];
                const n = this.elements.length;
                for (let i = 0; i < n; ++i) {
                    adj[i] = [];
                    for (let j = 0; j < n; ++j) adj[i][j] = -1;
                }
                [].concat(...this.adjacant)
                    .map((d, i) => [d, i])
                    .sort((a, b) => b[0] - a[0])
                    .slice(0, n * n * 0.15)
                    .map(d => d[1])
                    .forEach(d => adj[~~(d / n)][d % n] = this.adjacant[~~(d / n)][d % n]);
                return adj;
            },
        },
        methods: {
            click(i) {
                this.current = this.current == i ? null : i;
                this.$forceUpdate();
            },
            rectrender() {
                const svg = d3.select(this.$el)
                    .select(".sequence .graph svg");
                svg.selectAll("*").remove();
                const element = this.$el.getElementsByClassName("sequence")[0]
                    .getElementsByClassName("graph")[0]
                    .getElementsByTagName('svg')[0];

                const height = element.getBoundingClientRect().height;
                const width = element.getBoundingClientRect().width;

                const padding = 50;
                const node_width = 14;
                const node_height = 14;
                const gap = (width - padding * 2) / (n - 1);

                const data = this.elements;
                const n = data.length;
                const scalex = d3.scaleLinear()
                    .domain([data[0].time, data[n - 1].time])
                    .range([padding, width - padding]);
                const x = data.map(d => scalex(d.time));
                for (let i = n - 2; i >= 0; --i) {
                    if (x[i + 1] - x[i] < node_width) {
                        x[i] = x[i + 1] - node_width;
                    }
                }

                const x1 = (i) => x[~~(i / n)];
                const x2 = (i) => x[(i % n)];
                const radius = (i) => (x2(i) - x1(i)) * 0.4;
                const y = height * 0.5;
                const arc_data = [].concat(...this.adjacant);
                const max_adjacant = Math.max(...arc_data);
                const max_val = Math.max(...data.map(d => d.val));

                svg.append("line")
                    .attr("x1", padding)
                    .attr("x2", width - padding)
                    .attr("y1", y)
                    .attr("y2", y)
                    .attr("stroke", "#cccccc");

                var last = -1e10;
                for (var i = 0; i < n; ++i)
                    if (x[i] - last > 100) {
                        svg.append("line")
                            .attr("x1", x[i])
                            .attr("x2", x[i])
                            .attr("y1", y)
                            .attr("y2", y + 20)
                            .attr("stroke", "#cccccc");
                        
                        const date = new Date(data[i].time * 1000);
                        svg.append("text")
                            .attr("x", x[i] - 30)
                            .attr("y", y + 30)
                            .text(date.toISOString().slice(5, 16).replace('T', ' '))
                            .attr("color", "#333333")
                            .attr("font-size", "10px");
                        last = x[i];
                    }

                const arcs = svg.selectAll(".arc")
                    .data(arc_data)
                    .enter()
                    .append("path")
                    .attr("class", "arc")
                    .attr("d", (d, i) => {
                        return `M${x1(i)} ${y}
                        Q${(x1(i) + x2(i)) / 2} ${y - radius(i)}
                        ${x2(i)} ${y}`;
                    })
                    .attr("opacity", (d, i) => d / max_adjacant)
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .attr("stroke", "#1f78b4");
                
                const nodes = svg.selectAll(".node")
                    .data(this.elements)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("opacity", d => {
                        if (d.type == 'problem') {
                            return 1;
                        } else {
                            return (d.val / max_val) * (d.val / max_val);
                        }
                    })
                    .attr("transform", (d, i) => `translate(${x[i] - node_width / 2},${y - node_height / 2})`);

                nodes.append("rect")
                    .attr("width", node_width)
                    .attr("height", node_height)
                    .style("stroke", (d, i) => {
                        return d.type == 'video' ? 
                            this.context.color_schema[0] :
                            this.context.color_schema[2];
                    })
                    .style("fill", d => d.type == 'video' ? 
                        this.context.color_schema[1] :
                        this.context.color_schema[3]
                    );
                nodes.append("text")
                    .attr("dx", (d, i) => (d.type == 'problem' || i < 10) ?
                        node_width / 4 : 0)
                    .attr("dy", node_height - 2)
                    .attr("font-size", "12px")
                    .attr("fill", "white")
                    .text((d, i) => d.type == 'video' ? i : 1);
            }
        },
    };
</script>

<style scope>
.sequence {
    position: relative;
    height: 100%;
}

.sequence .patterns {
    position: absolute;
    top: 300px;
    left: 3vw;
    display: flex;
    flex-direction: column;
}

.sequence .patterns .pattern {
    display: block;
    padding-left: 1rem;
}

.sequence .patterns .pattern .head {
    background: rgb(62, 146, 174);
    margin-right: 1rem;
}
.sequence .patterns .pattern span {
    color: white;
    opacity: 0.9;
    float: left;
    padding: .1rem .25rem;
    margin-right: .5rem;
    margin-bottom: .25rem;
    font-size: 12px;
    height: 1.5rem;
}

.sequence .patterns .pattern.infrequent span {
    opacity: 0.7;
}

.sequence .graph {
    width: 100%;
    height: 400px;
}

.sequence .graph svg {
    width: 100%;
    height: 100%;
}
</style>