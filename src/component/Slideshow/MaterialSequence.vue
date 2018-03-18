<template>
    <div class="slideshow-page">
        <text-box v-for="note in item.notes" v-model="note.value"></text-box>
        <template v-if="item && item.loaded">
            <div class="slideshow-content title">
                <h4> {{ item.name }} </h4>
            </div>
            <div class="slideshow-content sequence">
                <div class="graph">
                    <svg></svg>
                </div>
                <div class="patterns">
                    <h6> General learning sequences: </h6>
                    <div class="pattern" v-for="(pattern, p) in patterns">
                        <span class="head">
                            S{{p + 1}}
                        </span>
                        <span v-for="i in pattern.path" class="node" 
                            :class="{ active: current == i }"
                            @click="click(i)"
                            :style="{ 'background-color':
                            elements[i].type == 'video' ? context.color_schema[1] : context.color_schema[3]
                            }">
                            {{ elements[i].tag }}. {{ elements[i].name }}
                        </span>
                    </div>
                </div>
            </div>
            <follow-up :item="item" :context="context"></follow-up>
        </template>
    </div>
</template>

<script>
    import * as d3 from "d3";

    export default {
        data() {
            return {
                current: null,
            };
        },
        created() {
            this.context.bus.$on("add-text-box", (_id) => {
                if (_id == this.item._id) {
                    this.item.notes = this.item.notes.filter(d => d.value.text);
                    this.item.notes.push({
                        value: {
                            text: 'Click to edit',
                            position: { x: 50, y: 50 },
                        } 
                    });
                }
            });
        },
        mounted() {
            this.render();
        },
        computed: {
            sequence() {
                return this.item.data.sequence;
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
                this.current = this.current == i ? null : i;
                this.render(); 
            },
            render() {
                const svg = d3.select(this.$el)
                    .select(".slideshow-content.sequence .graph svg");
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
                const current = this.current;
                if (current) {
                    for (let i = 0; i < n; ++i) {
                        if (this.filtered_adj[current][i] > 0) {
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
                        if (current && (i % n == current || ~~(i / n) == current)) {
                            return Math.min(1, d / max_adjacant * 2);
                        } else {
                            return d / max_adjacant;
                        }
                    })
                    .attr("fill", "none")
                    .attr("stroke-width", (d, i) => {
                        if (current && (i % n == current || ~~(i / n) == current)) {
                            return 3;
                        } else {
                            return 1;
                        }
                    })
                    .attr("stroke", (d, i) => {
                        if (current) {
                            if ((i % n == current || ~~(i / n) == current)) {
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
                    .attr("transform", (d, i) => `translate(${x(i) - node_width / 2},${y - node_height / 2})`);

                nodes.append("rect")
                    .attr("width", node_width)
                    .attr("height", node_height)
                    .style("stroke", (d, i) => {
                        return d.type == 'video' ? 
                            this.context.color_schema[0] :
                            this.context.color_schema[2];
                    })
                    .style("stroke-width", (d, i) => {
                        if (current == i) {
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
.slideshow-content.text h6 {
    font-weight: 600;
}

.slideshow-content.sequence {
    position: relative;
    height: 100%;
}

.slideshow-content.sequence .patterns {
    position: absolute;
    top: 300px;
    left: 3vw;
    display: flex;
    flex-direction: column;
}

.slideshow-content.sequence .patterns .pattern {
    display: block;
    padding-left: 1rem;
}

.slideshow-content.sequence .patterns .pattern .head {
    background: rgb(62, 146, 174);
    margin-right: 1rem;
}
.slideshow-content.sequence .patterns .pattern span {
    color: white;
    opacity: 0.7;
    float: left;
    padding: .1rem .25rem;
    margin-right: .5rem;
    margin-bottom: .25rem;
    font-size: 12px;
    height: 1.5rem;
}

.slideshow-content.sequence .patterns .pattern span:hover {
    opacity: 1;
}

.slideshow-content.sequence .patterns .pattern span.active {
    opacity: 1;
}

.slideshow-content.sequence .graph {
    width: 100%;
    height: 400px;
}

.slideshow-content.sequence .graph svg {
    width: 100%;
    height: 100%;
}

.slideshow-content.sequence .graph svg .node {
    opacity: 0.8;
}

.slideshow-content.sequence .graph svg .node:hover {
    opacity: 1;
}
</style>