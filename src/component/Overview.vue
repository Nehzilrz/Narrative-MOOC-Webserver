<template>
    <svg class="overview-map" width="800" height="1400">
    </svg>
</template>

<script>
import * as Slide from "../lib/SlideTemplate";
import textwidth from "../lib/text-width";
import { color_schema } from "../lib/colors";
import * as d3 from "d3";
import { Array } from 'plottable/build/src/utils';
import { setTimeout } from 'plottable/build/src/utils/windowUtils';

export default {
    data() {
        return {
            root: null,
            width: 600,
            height: 900,
            padding: 50,
            prev_p: null,
            next_p: null,
            has_p: false,
            question_offset_x: 10,
            question_offset_y: 22,
            first_layer_compress: 0.5,
            second_layer_compress: 0.63,
            area_width: 200,
            margin: 50,
            fontsize: 12,
            fontfamily: "Arial",
            textpadding_left_right: 5,
            textpadding_top_bottom: 5,
            layer_gap: 15,
            svg: null,
            position: { x: 0, y: 0 },
        };
    },
    mounted() {
        const colors = d3.select(this.$el)
            .append("g")
            .attr("class", "color");

        this.svg = d3.select(this.$el)
            .append("g")
            .attr("class", "view")
            .attr("transform", `translate(${this.padding},${this.padding})`);

        for (let i = 0; i < color_schema.length; ++i) {
            for (let j = 0; j < color_schema.length; ++j)
                for (let k = 0; k < 4; ++k) {
                    const defs = colors.append("defs");
                    const grad = defs
                        .append("linearGradient")
                        .attr("id", `c${i}${j}${k}`)
                        .attr("x1", +(k == 0))
                        .attr("x2", +(k == 1))
                        .attr("y1", +(k == 2))
                        .attr("y2", +(k == 3));
                    grad
                        .append("stop")
                        .attr("offset", "0%")
                        .attr("stop-color", color_schema[i]);
                    grad
                        .append("stop")
                        .attr("offset", "100%")
                        .attr("stop-color", color_schema[j]);
                }
        }
    },
    watch: {
        trigger(val) {
            if (this.page && this.page.length > 0) {
                this.paint();
            }
        },
        page(val) {
            if (val && val.length > 0) {
                this.paint();
            }
        },
        position(val) {
            if (!this.svg) return;
            d3.select(this.$el).select("g.view").attr(
                    "transform",
                    `translate(${this.position.x}, ${this.position.y})`
                )
                .transition()
                .duration(500)
                .attr("transform", `translate(${val.x}, ${val.y})`);
        }
    },
    methods: {
        getRoot() {
            if (!this.page || this.page.length == 0) {
                return [];
            }
            const chapter_id = this.page[0].resource_id;
            let Q = [],
                P = [];

            const vnode = (id, r = chapter_id) => ({
                name: Slide.questions[id],
                abbrname: Slide.abbr_questions[id],
                type: Slide.relation.grouptype[Slide.relation.groupIdOf(id)],
                id: id,
                index: "",
                data: null,
                parent: null,
                resource_id: r,
            });

            const rnode = n => ({
                name: n.name,
                abbrname: n.abbrname,
                type: n.type,
                id: n.id,
                index: "",
                data: n,
                parent: null,
                resource_id: n.resource_id
            });

            let x;
            let head = 0,
                tail = 0;
            const visited = new Set();

            if (this.page.find(d => d.id == "O1")) {
                x = rnode(this.page.find(d => d.id == "O1"));
            } else {
                x = vnode("O1");
            }
            x.parent = chapter_id;
            Q.push(x);
            tail++;
            visited.add(x.id + x.resource_id);

            if (this.page.find(d => d.id == "S1")) {
                x = rnode(this.page.find(d => d.id == "S1"));
            } else {
                x = vnode("S1");
            }
            x.parent = chapter_id;
            Q.push(x);
            tail++;
            visited.add(x.id + x.resource_id);
            const group_visited = new Set();

            while (head < tail) {
                const u = Q[head];
                u.index = "" + head++;
                const gid = Slide.relation.groupIdOf(u.id);
                const group = Slide.relation.groups[gid];
                if (!group_visited.has(gid + u.resource_id)) {
                    group_visited.add(gid + u.resource_id);
                    P.push({
                        parent: u.parent,
                        abbrname: u.resource_id == chapter_id ? '' : this.$mapping[u.resource_id].name,
                        // u.type,
                        type: u.type,
                        index: gid + u.resource_id,
                    });
                    u.parent = gid + u.resource_id;
                } else if (u.resource_id != chapter_id) {
                    u.parent = gid + u.resource_id;
                }
                if (u.data && u.data.comparison_name) {
                    u.data.comparison_name.split(",").forEach(name => {
                        P.push({
                            parent: u.index,
                            abbrname: name,// u.type,
                            type: u.type,
                            index: gid + 'dig' + u.resource_id,
                        });
                    });
                }
                for (const id of group)
                    if (!visited.has(id + u.resource_id)) {
                        const v = this.page.find(
                            d => d.id == id && d.resource_id == u.resource_id
                        );
                        const element = v ? rnode(v) : vnode(id, u.resource_id);
                        element.parent = gid + u.resource_id;
                        Q.push(element);
                        tail++;
                        visited.add(id + u.resource_id);
                    }

                Slide.relation.edges.filter(e => e.source == gid).forEach(e => {
                    const target_group = Slide.relation.groups[e.target];
                    if (Slide.scopeOf(target_group[0]) == Slide.scopeOf(u.id)) {
                        const v = this.page.find(
                            d => target_group.includes(d.id) && d.resource_id == u.resource_id
                        );
                        const target = v ? rnode(v) : vnode(target_group[0], u.resource_id);
                        if (!visited.has(target.id + target.resource_id)) {
                            target.parent = gid + u.resource_id;
                            Q.push(target);
                            tail++;
                            visited.add(target.id + target.resource_id);
                        }
                    }

                    this.page
                        .filter(
                            d => target_group.includes(d.id) && d.resource_id != u.resource_id
                        )
                        .forEach(d => {
                            const target = rnode(d);
                            if (!visited.has(target.id + target.resource_id)) {
                                target.parent = (gid + u.resource_id)
                                //d.parent ? Q.find(e => e.data && e.data._id == d.parent).index
                                  //              : (gid + u.resource_id);
                                Q.push(target);
                                tail++;
                                visited.add(target.id + target.resource_id);
                            }
                        });
                });
            }
            P.push({
                parent: null,
                abbrname: "homepage",
                type: "root",
                index: chapter_id,
            });
            const data = Q.concat(P);
            const stratify = d3
                .stratify()
                .id(d => d.index)
                .parentId(d => d.parent);
            const root = stratify(data);
            return root;
        },
        find(item) {
            return this.root.descendants().find(d => d.data.data == item);
        },
        locate(item) {
            if (item.comparison) {
                const parent = this.root.descendants().find(d => d.data.data == item);
                return this.root.descendants().find(d => d.parent == parent);
            } else {
                return this.root.descendants().find(d => d.data.data == item);
            }
        },
        paint() {
            const g = this.svg;
            g.selectAll("*").remove();

            var tree = d3.tree().size([this.width, this.height]);
            const chapter_id = this.page[0].resource_id;
            this.root = this.getRoot();
            const root = this.root;
            tree(root);
            const x0 = root.descendants().find(d => d.depth == 0).y;
            const x1 = root.descendants().find(d => d.depth == 1).y;
            const x2 = root.descendants().find(d => d.depth == 2).y;
            const first_layer_reduction = (x1 - x0) * (1 - this.first_layer_compress);
            const second_layer_reduction = (x2 - x0) * (1 - this.second_layer_compress);
            root.descendants().forEach(d => {
                if (d.depth >= 2) {
                    d.y -= second_layer_reduction;
                } else if (d.depth >= 1) {
                    d.y -= first_layer_reduction;
                }
            });
            this.has_p = false;

            this.page.map(d => this.find(d)).forEach(d => {
                while (d != null) {
                    d.tag = true;
                    d = d.parent;
                }
            });

            var node_group = g.append("g")
                .attr("class", "nodes");

            var legend_group = g.append("g")
                .attr("class", "legend");

            var link = node_group
                .selectAll(".link")
                .data(root.descendants().slice(1))
                .enter()
                .append("path")
                .attr("class", d => "link" + ((d.tag && d.parent.tag) ? " link--active" : ""))
                .attr("stroke-dasharray", d => d.data.index.includes('dig') ? '10' : '0')
                .attr("d", diagonal);

            const padding = 25;
            const text_dx = 25;
            const text_dy = 14;

            var node = node_group
                .selectAll(".nodebg")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("class", "nodebg")
                .attr("transform", (d) => {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            const get_color_schema = type => {
                if (type == "video") {
                    return color_schema.slice(0, 2);
                } else if (type == "assignment") {
                    return color_schema.slice(2, 4);
                } else if (type == "learner") {
                    return color_schema.slice(4, 6);
                } else if (type == "forum") {
                    return color_schema.slice(6, 8);
                } else if (type == "student") {
                    return color_schema.slice(8, 10);
                } else {
                    return "lightgray";
                }
            };

            const color_scale = d => get_color_schema(d.data.type)[0];

            node.append("rect")
                .attr("width", d =>
                    2 * this.textpadding_left_right +
                    textwidth(d.data.abbrname, {
                        family: this.fontfamily,
                        size: this.fontsize
                    })
                )
                .attr("x", 3)
                .attr("y", -this.textpadding_top_bottom)
                .attr("display", d => d.data.abbrname == '' ? 'none' : 'block')
                .attr("height", d => this.fontsize)
                .attr("rx", 5)
                .attr("ry", 5)
                .style("fill", "white");

            node
                .append("circle")
                .attr("cx", 5)
                .attr("cy", 0)
                .attr("r", 5)
                .style("fill", 'white');

            node
                .append("text")
                .text(d => d.data.abbrname)
                .attr("dx", d => 15)
                .attr("dy", d => 3)
                .style("font-size", "14px")
                .style("font-family", "Arial")
                .style("fill", d => {
                    return (d.data.data ? "#222" : "#ccc")
                });

            const path_nodes = this.page.map(d => this.find(d));
            const path_edges = path_nodes.slice(1).map((d, i) => ({
                source: path_nodes[i], target: d,
            }));
            const edge_color_scale = e => {
                let a = ["video", "assignment", "learner", "forum", "student"].indexOf(
                    e.source.data.type
                );
                let b = ["video", "assignment", "learner", "forum", "student"].indexOf(
                    e.target.data.type
                );
                if (a == -1) a = 8;
                else a = a * 2;
                if (b == -1) b = 8;
                else b = b * 2;
                let c;
                if (Math.abs(e.source.y - e.target.y) > Math.abs(e.source.x - e.target.x)) {
                    if (e.source.y > e.target.y) {
                        c = 0;
                    } else {
                        c = 1;
                    }
                } else {
                    if (e.source.x > e.target.x) {
                        c = 2;
                    } else {
                        c = 3;
                    }
                }
                return `url(#c${a}${b}${c})`;
            };
            const pathwidth = 15;
            const m = path_edges.length - 1;

//"learner"
            const legend = legend_group.selectAll(".legend")
                .data(["student", "video", "assignment", "forum"])
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${0}, ${i * 20})`);

            legend
                .append("circle")
                .attr("class", "node node--visited node--active")
                .attr("cx", 5)
                .attr("cy", 0)
                .style("fill", d => get_color_schema(d)[0]);

            legend
                .append("text")
                .text(d => d == "student" ? "overall" : d)
                .attr("dx", d => 15)
                .attr("dy", d => 4)
                .style("font-size", "14px")
                .style("font-family", "Arial")
                .style("fill", "#222");

            const learner_legend = legend_group
                .append("g")
                .attr("class", "legend")
                .attr("transform", (d, i) => `translate(${0}, ${80})`);

            learner_legend
                .append("rect")
                .attr("class", "node node--visited node--active")
                .attr("x", 0)
                .attr("y", -5)
                .style("fill", get_color_schema('learner')[0]);

            learner_legend
                .append("text")
                .text('learner oriented')
                .attr("dx", d => 15)
                .attr("dy", d => 4)
                .style("font-size", "14px")
                .style("font-family", "Arial")
                .style("fill", "#222");

            const path = node_group.selectAll(".path")
                .data(path_edges)
                .enter()
                .append("path")
                .attr("d", (d, i) => {
                    if (d.source.data.type == 'assignment' && d.target.data.type == 'video' &&
                        d.target.data.resource_id != chapter_id &&
                        d.source.data.resource_id != chapter_id) return '';
                    if (Math.abs(d.source.x - d.target.x) > Math.abs(d.source.y - d.target.y)) {
                        const x0 = d.source.y + 5 - pathwidth / 2;
                        const y0 = d.source.x;
                        const x1 = d.source.y + 5 + pathwidth / 2;
                        const y1 = d.source.x;
                        const x2 = d.target.y + 5 - pathwidth / 2;
                        const y2 = d.target.x;
                        const x3 = d.target.y + 5 + pathwidth / 2;
                        const y3 = d.target.x;
                        return `M${x0},${y0} 
                            C${x0},${(y0 * 2 + y2) / 3}
                            ${x2},${(y0 + y2 * 2) / 3}
                            ${x2},${y2}
                            L${x3},${y3} 
                            C${x3},${(y3 * 2 + y1) / 3}
                            ${x1},${(y3 + y1 * 2) / 3}
                            ${x1},${y1}Z`;
                    } else {
                        const x0 = d.source.y + 5;
                        const y0 = d.source.x - pathwidth / 2;
                        const x1 = d.source.y + 5;
                        const y1 = d.source.x + pathwidth / 2;
                        const x2 = d.target.y + 5;
                        const y2 = d.target.x - pathwidth / 2;
                        const x3 = d.target.y + 5;
                        const y3 = d.target.x + pathwidth / 2;
                        return `M${x0},${y0} 
                            C${x0},${(y0 * 2 + y2) / 3}
                            ${x2},${(y0 + y2 * 2) / 3}
                            ${x2},${y2}
                            L${x3},${y3} 
                            C${x3},${(y3 * 2 + y1) / 3}
                            ${x1},${(y3 + y1 * 2) / 3}
                            ${x1},${y1}Z`;
                    }
                })
                .attr("fill", d => edge_color_scale(d))
                .attr("opacity", 0.4); 

            const start = path_nodes[0];
            node_group.append("path")
                .attr("class", "starting")
                .attr("transform", `translate(${start.y - 8},${start.x - 58}) scale(0.15)`)
                .style("fill", color_scale(start))
                .attr("d", "M155.799,234.678c11.766-14.877,18.798-33.661,18.798-54.058c0-48.136-39.162-87.298-87.298-87.298S0,132.484,0,180.621   c0,20.397,7.032,39.18,18.798,54.058l68.5,86.124L155.799,234.678z M67.298,180.621c0-11.028,8.972-20,20-20s20,8.972,20,20   s-8.972,20-20,20S67.298,191.649,67.298,180.621z");
                
            const end = path_nodes[path_nodes.length - 1];
            node_group.append("path")
                .attr("class", "ending")
                .attr("transform", `translate(${end.y - 8},${end.x - 58}) scale(0.15)`)
                .style("fill", color_scale(end))
                .attr("d", "M155.799,234.678c11.766-14.877,18.798-33.661,18.798-54.058c0-48.136-39.162-87.298-87.298-87.298S0,132.484,0,180.621   c0,20.397,7.032,39.18,18.798,54.058l68.5,86.124L155.799,234.678z M67.298,180.621c0-11.028,8.972-20,20-20s20,8.972,20,20   s-8.972,20-20,20S67.298,191.649,67.298,180.621z");
                
            const draw_p = () => {
                const prev = this.prev_p;
                const d = this.next_p;
                const x1 = (prev.y + d.y) * 0.5 + (d.y - prev.y) * 0.2 + 75;
                const y1 = (prev.x + d.x) * 0.5;
                node_group.append("path")
                    .attr("class", "related")
                    .attr("d", `M${prev.y + 5},${prev.x} Q${x1} ${y1} ${d.y + 5},${d.x}`)
                    .attr("stroke", color_scale(d))
                    .attr("stroke-width", 5)
                    .attr("stroke-dasharray", "20, 10")
                    .attr("opacity", 0.4)
                    .attr("fill", "none");
            }

            let prev = null;
            const handle = (d) => {
                if (d3.event.altKey) {
                    if (!this.prev_p) {
                        this.prev_p = d;
                    } else if (!this.next_p) {
                        this.next_p = d;
                        node_group.selectAll(".related").remove();
                        draw_p();
                        this.has_p = true;
                    } else {
                        this.has_p = false;
                        node_group.selectAll(".related").remove();
                        this.prev_p = this.next_p = null;
                    }
                    return;
                }
                this.$bus.$emit('load_slide', d.data.id, d.data.resource_id, null);
            };

            if (this.prev_p && this.next_p) {
                this.has_p = true;
                draw_p();
            }
            
            node_group.append("circle")
                .attr("class", "ending")
                .attr("opacity", 0.4)
                .attr("r", 10) 
                .attr("transform", () => {
                    return "translate(" + (end.y + 5) + "," + end.x + ")";
                })
                .style("fill", color_scale(end))

            const node_circle = node_group
                .selectAll("circle.node")
                .data(root.descendants().filter(d => d.data.type != "learner"))
                .enter()
                .append("g")
                .attr("transform", (d) => {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            node_circle
                .append("circle")
                .attr("class", (d) => {
                    return "node" + (d.data.data ? " node--visited" : "")
                        + (d.data.index.includes('dig') ? " node--dig" : "")
                        + (d.tag ? " node--active" : "");
                })
                .attr("x", 5)
                .attr("cx", 5)
                .attr("cy", 0)
                .style("fill", d => color_scale(d))
                .on('click', handle);

            const node_rect = node_group
                .selectAll("rect.node")
                .data(root.descendants().filter(d => d.data.type == "learner"))
                .enter()
                .append("g")
                .attr("transform", (d) => {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            node_rect
                .append("rect")
                .attr("class", (d) => {
                    return "node" + (d.data.data ? " node--visited" : "")
                        + (d.data.index.includes('dig') ? " node--dig" : "")
                        + (d.tag ? " node--active" : "");
                })
                .attr("x", 0)
                .attr("y", -5)
                .style("fill", d => color_scale(d))
                .on('click', handle);

            function diagonal(d) {
                return ("M" + d.y + "," + d.x +
                    "C" + ((d.parent.y + d.y) / 2) + "," + d.x + " " +
                    ((d.parent.y + d.y) / 2) + "," + d.parent.x + " " +
                    d.parent.y + "," + d.parent.x);
            }
        },
        adjust(item) {
            setTimeout(() => {
                let position = { x: this.padding, y: this.padding };
                if (!this.active) {
                    if (!item) return;
                    const node = this.locate(item);
                    if (!node || !node.x || !node.y) return;
                    const x = -node.y + this.padding + 50;
                    const y = -node.x + this.padding;
                    position = { x, y };
                }
                if (position.x != this.position.x || position.y != this.position.y)
                    this.position = position;
            }, 50);
        }
    },
    props: ['active', 'page', 'trigger']
};
</script>

<style scope>
.overview-map {
    width: 100%;
    height: 100%;
    color: #333;
    background-color: white;
  box-shadow: inset 0px -4px 10px rgba(0, 0, 0, 0.08), 
            inset 0px 4px 5px rgba(0, 0, 0, 0.08),
            inset -4px 0px 5px rgba(0, 0, 0, 0.08);
}

.overview-map .node {
    fill-opacity: 0.2;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}

.overview-map rect.node {
    width: 10px;
    height: 10px;
}

.overview-map circle.node {
    r: 5px;
}
.overview-map .node.node--visited {
    fill-opacity: 1;
}

.overview-map .starting {
    fill-opacity: 0.8;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}
.overview-map .ending {
    fill-opacity: 0.8;
    transition: 0.2s;
    transition-timing-function: ease-in-out;
}

.overview-map .node.node--dig {
    stroke: #999;
    fill-opacity: 0.4;
    stroke-width: 2px;
}

.overview-map .node.node--active {
    fill-opacity: 0.7;
    stroke: #999;
    stroke-width: 1px;
}

.overview-map .node:hover,.node.node--ending {
    fill-opacity: 1;
    stroke: #777;
    stroke-width: 1px;
}

.overview-map circle.node:hover,.node.node--ending {
    r: 10px;
}
.overview-map rect.node:hover,.node.node--ending {
    height: 15px;
    width: 15px;
}

.overview-map .nodebg text {
    font: 10px sans-serif;
}

.overview-map .link {
    fill: none;
    stroke: #999;
    stroke-opacity: 0.4;
    stroke-width: 1.5px;
}

.overview-map .link.link--active {
    stroke-opacity: 0.7;
}
</style>
