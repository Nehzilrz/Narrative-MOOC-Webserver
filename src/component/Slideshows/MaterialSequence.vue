<template>
<div>
    <div class="slide b4w bh nm-block sequence">
        <div class="graph nm-block">
            <svg></svg>
        </div>
        <div class="patterns">
            <h6 class="nm-block"> General learning sequences: </h6>
            <div class="pattern nm-block" v-for="(pattern, p) in patterns">
                <span class="head">
                    S{{p + 1}}
                </span>
                <span v-for="i in pattern.path" class="node" 
                    :class="{ active: last_element == i }"
                    @click="click(i)"
                    :style="{ 'background-color':
                    elements[i].type == 'video' ? context.color_schema[1] : context.color_schema[3]
                    }">
                    {{ elements[i].tag }}. {{ elements[i].name }}
                </span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import * as d3 from "d3";
    import SlideshowBase from "./SlideshowBase.vue";

    export default {
        data() {
            return {
            };
        },
        extends: SlideshowBase,
        mounted() {
            this.render();
        },
        computed: {
            sequence() {
                return this.data.sequence;
            },
            adjacant() {
                return this.sequence.adj;
            },
            elements() {
                const count = {};
                return this.sequence.modules.map(d => {
                    const name = d.name.split(' ');
                    return {
                        id: d.id,
                        name: name.length < 3 ? d.name : name.slice(
                            name.length - 3, name.length
                        ).join(' '),
                        type: d.type,
                        tag: (count[d.type] = (count[d.type] || 0) + 1),
                    };
                });
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
            patterns() {
                const adj = this.filtered_adj;
                const n = this.elements.length;
                const mark = [];
                const paths = [];
                let path = [];

                function dfs(x) {
                    path.push(x);
                    mark[x] = 1;
                    let max_adj = 0;
                    
                    for (let i = 0; i < n; ++i) {
                        max_adj = Math.max(max_adj, adj[x][i]);
                    }

                    for (let i = x + 1; i < n; ++i) {
                        if (adj[x][i] == max_adj && !mark[i]) {
                            dfs(i);
                            return;
                        }
                    }

                    for (let i = 0; i < x; ++i) {
                        if (adj[x][i] == max_adj) {
                            path.push(i);
                            return;
                        }
                    }
                }

                for (let i = 0; i < n; ++i) {
                    path = [];
                    for (let j = 0; j < n; ++j) mark[j] = 0;
                    dfs(i);
                    if (path.length >= 3) {
                        let val = 0;
                        for (let j = 0; j < path.length - 1; ++j) {
                            val += adj[path[j]][path[j + 1]];
                            adj[path[j]][path[j + 1]] = -1;
                        }
                        val /= path.length;
                        paths.push({ path, val });
                    } 
                }
                
                return paths.sort((a, b) => b.val - a.val).slice(0, 4);
            }
        },
        methods: {
            click(i) {
                this.last_element = this.last_element == i ? null : i;
                this.render(); 
            },
            render() {
                const svg = d3.select(this.$el)
                    .select(".slide.sequence .graph svg");
                svg.selectAll("*").remove();
                const element = this.$el.getElementsByClassName("sequence")[0]
                    .getElementsByClassName("graph")[0]
                    .getElementsByTagName('svg')[0];

                const height = element.getBoundingClientRect().height;
                const width = element.getBoundingClientRect().width;

                const padding = 50;
                const n = this.elements.length;
                const node_width = 14;
                const node_height = 14;
                const gap = (width - padding * 2) / (n - 1);
                const x = (i) => gap * i + padding;
                const x1 = (i) => gap * ~~(i / n) + padding;
                const x2 = (i) => gap * (i % n) + padding;
                const radius = (i) => (i % n - ~~(i / n)) * gap * 0.5;
                const y = height * 0.5;
                const arc_data = [].concat(...this.adjacant);
                const highlight = [];
                const last_element = this.last_element;
                if (last_element) {
                    for (let i = 0; i < n; ++i) {
                        if (this.filtered_adj[last_element][i] > 0) {
                            highlight[i] = true;
                        }
                    }
                }
                const max_adjacant = Math.max(...arc_data);

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
                    .attr("opacity", (d, i) => {
                        if (last_element && (i % n == last_element || ~~(i / n) == last_element)) {
                            return Math.min(1, d / max_adjacant * 2);
                        } else {
                            return d / max_adjacant;
                        }
                    })
                    .attr("fill", "none")
                    .attr("stroke-width", (d, i) => {
                        if (last_element && (i % n == last_element || ~~(i / n) == last_element)) {
                            return 3;
                        } else {
                            return 1;
                        }
                    })
                    .attr("stroke", (d, i) => {
                        if (last_element) {
                            if ((i % n == last_element || ~~(i / n) == last_element)) {
                                return '#1f78b4';
                            } else {
                                return 'gray';
                            }
                        } else {
                            return '#1f78b4';
                        }
                    });
                
                const nodes = svg.selectAll(".node")
                    .data(this.elements)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", (d, i) => `translate(${x(i) - node_width / 2},${y - node_height / 2})`)
                    .on("mousemove", (d) => {
                        this.show_tooltip = true;
                        this.current_point.x = d3.event.layerX;
                        this.current_point.y = d3.event.layerY;
                        const x = this.$mapping[d.id];
                        this.tooltip_message = `${x.type}: ${x.name}`;
                    })
                    .on("mouseout", (d) => {
                        setTimeout(() => { this.show_tooltip = 0; }, 500);
                    });

                nodes.append("rect")
                    .attr("width", node_width)
                    .attr("height", node_height)
                    .style("stroke", (d, i) => {
                        return d.type == 'video' ? 
                            this.context.color_schema[0] :
                            this.context.color_schema[2];
                    })
                    .style("stroke-width", (d, i) => {
                        if (last_element == i) {
                            return 5;
                        } else if (highlight[i]) {
                            return 3;
                        } else {
                            return 0;
                        }
                    })
                    .style("fill", d => d.type == 'video' ? 
                        this.context.color_schema[1] :
                        this.context.color_schema[3]
                    );

                nodes.append("text")
                    .attr("dx", d => d.tag < 10 ? node_width / 4 : 0)
                    .attr("dy", node_height - 2)
                    .attr("font-size", "12px")
                    .attr("fill", "white")
                    .text(d => d.tag);
    /*
                const patterns = svg.selectAll(".pattern")
                    .data(this.patterns)
                    .enter()
                    .append("g")
                    .attr("class", "pattern")
                    .attr("transform", (d, i) => `translate(${padding}, ${height - (i + 1) * node_height * 2})`);

                const pattern = patterns.selectAll(".node")
                    .data(d => d.path)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .attr("transform", (d, i) => `translate(${i * node_width * 4}, 0)`);

                pattern.append("rect")
                    .attr("width", node_width)
                    .attr("height", node_height)
                    .style("fill", d => this.elements[d].type == 'video' ? 
                        this.context.color_schema[1] :
                        this.context.color_schema[3]
                    );

                pattern.append("text")
                    .attr("dx", d => this.elements[d].tag < 10 ? node_width / 4 : 0)
                    .attr("dy", node_height - 2)
                    .attr("font-size", "12px")
                    .attr("fill", "white")
                    .text(d => this.elements[d].tag);
                    */
            }
        },
        props: ["item", "context"],
    };
</script>

<style scope>
.slide.text h6 {
    font-weight: 600;
}

.slide.sequence {
    position: relative;
    height: 100%;
}

.slide.sequence .patterns {
    position: absolute;
    top: 300px;
    left: 3vw;
    display: flex;
    flex-direction: column;
}

.slide.sequence .patterns .pattern {
    display: block;
    padding-left: 1rem;
}

.slide.sequence .patterns .pattern .head {
    background: rgb(62, 146, 174);
    margin-right: 1rem;
}
.slide.sequence .patterns .pattern span {
    color: white;
    opacity: 0.7;
    float: left;
    padding: .1rem .25rem;
    margin-right: .5rem;
    margin-bottom: .25rem;
    font-size: 12px;
    height: 1.5rem;
}

.slide.sequence .patterns .pattern span:hover {
    opacity: 1;
}

.slide.sequence .patterns .pattern span.active {
    opacity: 1;
}

.slide.sequence .graph {
    width: 100%;
    height: 400px;
    position: relative;
}

.slide.sequence .graph svg {
    width: 100%;
    height: 100%;
}

.slide.sequence .graph svg .node {
    opacity: 0.8;
}

.slide.sequence .graph svg .node:hover {
    opacity: 1;
}
</style>