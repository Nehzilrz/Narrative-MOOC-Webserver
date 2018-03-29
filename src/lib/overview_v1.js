import * as Slide from "./SlideTemplate";
import textwidth from "./text-width";
import { color_schema } from "./colors";
import * as d3 from "d3";

export function paintOverview(self) {
    if (self.is_painting) {
        return;
    }
    self.is_painting = true;

    const graph = self.overview_graph;
    const svg = self.overview.svg;
    svg.selectAll("*").remove();

    const view = svg
        .append("g")
        .attr("class", "view")
        .attr(
        "transform",
        `translate(${self.overview.padding},${self.overview.padding})`
        );

    const nodes = view
        .selectAll(".nodes")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "nodes")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    const edges = view
        .selectAll(".edges")
        .data(graph.edges)
        .enter()
        .append("g")
        .attr("class", "edges");

    const edge_color_scale = e => {
        let a = ["video", "assignment", "student", "forum"].indexOf(
        e.source.type
        );
        let b = ["video", "assignment", "student", "forum"].indexOf(
        e.target.type
        );
        if (a == -1) a = 8;
        else a = a * 2;
        if (b == -1) b = 8;
        else b = b * 2;
        return `url(#c${a}${b})`;
    };

    edges
        .append("path")
        .attr("d", (d, i) => {
        const x0 =
            d.source.x +
            d.source.bottom.x0 +
            (d.source.bottom.x1 - d.source.bottom.x0) *
            (d.rank / d.source.degree);
        const y0 = d.source.y + d.source.height + 4.9;
        const x1 =
            d.source.x +
            d.source.bottom.x0 +
            (d.source.bottom.x1 - d.source.bottom.x0) *
            ((d.rank + 1) / d.source.degree);
        const y1 = d.source.y + d.source.height + 4.9;
        const x2 = d.target.x + d.target.top.x0;
        const y2 = d.target.y - 4.9;
        const x3 = d.target.x + d.target.top.x1;
        const y3 = d.target.y - 4.9;
        return `M${x0},${y0} 
            C${x0},${(y0 * 2 + y2) / 3}
            ${x2},${(y0 + y2 * 2) / 3}
            ${x2},${y2}
            L${x3},${y3} 
            C${x3},${(y3 * 2 + y1) / 3}
            ${x1},${(y3 + y1 * 2) / 3}
            ${x1},${y1}
            Z`;
        })
        .attr("fill", d => edge_color_scale(d))
        .attr("opacity", 0.2);

    const get_color_schema = type => {
        if (type == "video") {
        return color_schema.slice(0, 2);
        } else if (type == "assignment") {
        return color_schema.slice(2, 4);
        } else if (type == "student") {
        return color_schema.slice(4, 6);
        } else if (type == "forum") {
        return color_schema.slice(6, 8);
        } else {
        return color_schema.slice(8, 10);
        }
    };

    const text_dx = 25;
    const text_dy = 14;
    const color_scale = d => get_color_schema(d.type)[0];
    const type_color_scale = type => get_color_schema(type)[0];

    const outerArea = d3
        .area()
        .curve(d3.curveBasis)
        .x0(d => d.x0)
        .x1(d => d.x1)
        .y(d => d.y);

    nodes
        .append("path")
        .attr("d", d => outerArea(d.background))
        .style("fill", d => color_scale(d))
        .style("opacity", 0.2);

    const items = nodes
        .selectAll(".node")
        .data(d => d.data)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .on("click", d => {
        if (d._id == -1) {
            self.findNext(null, {
            id: d.id,
            resource_id: d.resource_id,
            group: 0,
            item: null,
            });
        } else {
            self.findNext(null, self.page.find(e => e._id == d._id));
        }
        });

    items
        .append("rect")
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", d => color_scale(d))
        .style("fill-opacity", d => (d._id == -1 ? 0.5 : 1));

    items
        .append("circle")
        .attr("cx", 10)
        .attr("cy", d => d.height / 2)
        .attr("r", 5)
        .style("fill", "white")
        .style("fill-opacity", d => (d._id == -1 ? 0.3 : 1));

    items
        .append("text")
        .text(d => d.name)
        .attr("dx", d => d.padding)
        .attr("dy", d => d.height / 2 + 4)
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .style("fill", d => (d._id == -1 ? "#bbbbbb" : "white"));
    self.is_painting = false;
}

export function get_overview_graph(self) {
    /*

    const init_nodes = [0, 1, 2, 3, 8];
    const _typeof = (x) => {
        if (x.includes('A')) {
        return 'assignment';
        } else if (x.includes('V')) {
        return 'video';
        } else if (x.includes('F')) {
        return 'forum';
        } else {
        return 'student';
        }
    };
    for (const i of init_nodes) {
        const node = Slide.relation.groups[i]
        .map(d => {
            const x = self.pages.find(e => e.id == d);
            return x ? x : {
            name: Slide.questions[d],
            abbrname: Slide.abbr_questions[d],
            type: _typeof(d),
            id: d,
            _id: -1,
            resource_id: self.current_chapter.id,
            };
        });
        nodes.push(node);
        nodes_num += 1;
    }

    const group_id_map = {};
    for (const x of self.page) {
        const group_x = Slide.relation.groupIdOf(x.id);
        if (!init_node.includes(group_x)) {
        if (!group_id_map[group_x + x.resource_id]) {
            x.group_id = nodes_num;
            nodes.push([]);
            group_id_map[group_x + x.resource_id] = nodes_num;
            nodes_num++;
        } else {
            x.group_id = group_id_map[group_x + x.resource_id];
        }
        }
        nodes[x.group_id].push(x);
    }
*/

/*
    let nodes = [];
    let edges = [];
    let nodes_num = 0;
    for (const x of self.page) {
        const parent = self.page.find(d => d._id == x.parent);
        if (
        parent &&
        Slide.relation.groupIdOf(x.id) ==
            Slide.relation.groupIdOf(parent.id)
        ) {
        x.group_id = parent.group_id;
        } else {
        x.group_id = nodes_num++;
        nodes.push([]);
        if (parent) {
            edges.push({
            source: parent.group_id,
            target: x.group_id
            });
        }
        }
        nodes[x.group_id].push(x);
    }

    const virtualnodes = [];
    const virtualedges = [];

    for (var i = 0; i < nodes.length; ++i) {
        const node = nodes[i];
        const ids = node.map(d => d.id);
        const group_id = Slide.relation.groupIdOf(node[0].id);
        const virtualnode = Slide.relation.groups[group_id]
        .filter(d => !ids.includes(d))
        .map(d => ({
            name: Slide.questions[d],
            abbrname: Slide.abbr_questions[d],
            type: node[0].type,
            id: d,
            _id: -1,
            parent_id: node[0]._id
        }));
        for (const x of virtualnode) {
        node.push(x);
        }

        const targets = edges
        .filter(d => d.source == i)
        .map(d => Slide.relation.groupIdOf(nodes[d.target][0].id));
        let virtualtargets = Slide.relation.edges.filter(
        d => group_id == d.source && !targets.includes(d.target)
        );
        virtualtargets = virtualtargets.map(d =>
        Slide.relation.groups[d.target].map(e => ({
            name: Slide.questions[e],
            abbrname: Slide.abbr_questions[e],
            type: Slide.relation.grouptype[d.target],
            id: e,
            _id: -1,
            parent_id: node[0]._id
        }))
        );
        for (const target of virtualtargets) {
        virtualnodes.push(target);
        virtualedges.push({
            source: i,
            target: nodes_num
        });
        nodes_num++;
        }
    }
    nodes = nodes.concat(virtualnodes);
    edges = edges.concat(virtualedges);
    const depth = [];
    for (let i = 0; i < nodes.length; ++i) {
        depth[i] = Math.max(
        ...edges
            .filter(e => e.target == i)
            .map(e => depth[e.source] + 1)
            .concat([0])
        );
    }
    const max_depth = Math.max(...depth) + 1;

    */

    let nodes = [];
    let edges = [];
    let nodes_num = 0;
    let root = null, root2 = null;
    let Q = [];
    if (self.page.find(d => d.id == 'O1')) {
        root = self.page.find(d => d.id == 'O1');
    } else {
        root = {
            name: Slide.questions['O1'],
            abbrname: Slide.abbr_questions['O1'],
            type: 'student',
            id: 'O1',
            _id: -1,
            resource_id: self.current_chapter.id,
        };
    }
    if (self.page.find(d => d.id == 'S1')) {
        root2 = self.page.find(d => d.id == 'S1');
    } else {
        root2 = {
            name: Slide.questions['S1'],
            abbrname: Slide.abbr_questions['S1'],
            type: 'student',
            id: 'S1',
            _id: -1,
            resource_id: self.current_chapter.id,
        };
    }
    Q.push(root);
    Q.push(root2);
    nodes_num += 2;
    let current_node = -1;
    const depth = [0, 0];
    while (Q.length > 0) {
        const u = Q[0];
        Q.shift();
        if (nodes.find(elements => elements.find(d => d.id == u.id && d.resource_id == u.resource_id))) {
        continue;
        }
        current_node += 1;
        const gid = Slide.relation.groupIdOf(u.id);
        const group = Slide.relation.groups[gid];
        const elements = [u];
        for (const id of group) if (id != u.id) {
        const element = self.page.find(d => d.id == id && d.resource_id == u.resource_id)
            || {
            name: Slide.questions[id],
            abbrname: Slide.abbr_questions[id],
            type: Slide.relation.grouptype[gid],
            id: id,
            _id: -1,
            resource_id: u.resource_id,
            };
        elements.push(element);
        }
        nodes.push(elements);
        if (!elements.find(d => d._id != -1) && nodes_num > 1) continue;

        Slide.relation.edges.filter(e => e.source == gid)
        .forEach(e => {
            const target_group = Slide.relation.groups[e.target];
            if (Slide.scopeOf(target_group[0]) == Slide.scopeOf(u.id)) {
            const target = self.page.find(d => target_group.includes(d.id) && d.resource_id == u.resource_id)
            || {
                name: Slide.questions[target_group[0]],
                abbrname: Slide.abbr_questions[target_group[0]],
                type: Slide.relation.grouptype[e.target],
                id: target_group[0],
                _id: -1,
                resource_id: u.resource_id,
            };
            Q.push(target);
            edges.push({ source: current_node, target: nodes_num });
            depth[nodes_num] = depth[current_node] + 1;
            nodes_num += 1;
            }

            self.page.filter(d => target_group.includes(d.id) && d.resource_id != u.resource_id)
            .forEach(d => {
                Q.push(d);
                edges.push({ source: current_node, target: nodes_num });
                depth[nodes_num] = depth[current_node] + 1;
                nodes_num += 1;
            });
        });
    }
    const max_depth = Math.max(...depth) + 1;

    nodes = nodes.map((d, i) => {
        const padding = 25;
        const data = d.map(item => ({
        _id: item._id,
        name: item.abbrname,
        parent_id: item.parent_id,
        id: item.id,
        type: item.type,
        padding: padding,
        height:
            self.overview.fontsize + 2 * self.overview.textpadding_top_bottom,
        width:
            padding +
            2 * self.overview.textpadding_left_right +
            textwidth(item.abbrname, {
            family: self.overview.fontfamily,
            size: self.overview.fontsize
            })
        }));
        const max_width = Math.max(
        ...data.map(t => t.width + 2 * self.overview.textpadding_top_bottom)
        );
        data.forEach((t, i) => {
        t.x = (max_width - t.width) / 2;
        t.y =
            i == 0
            ? 0
            : data[i - 1].y +
                data[i - 1].height +
                self.overview.textpadding_top_bottom;
        });
        return {
        depth: depth[i],
        data: data,
        height: Math.max(...data.map(t => t.height + t.y)),
        width: max_width,
        index: i,
        };
    });

    const cdegree = {};
    edges = edges.map(d => {
        cdegree[d.source] = (cdegree[d.source] || 0) + 1;
        return {
        rank: cdegree[d.source] - 1 || 0,
        source: nodes[d.source],
        target: nodes[d.target]
        };
    });

    nodes.forEach(d => {
        d.degree = edges.filter(e => e.source == d).length || 1;
    });

    const width = self.overview.width - self.overview.padding * 2;
    const height = self.overview.height - self.overview.padding * 2;

    let y1 = self.overview.padding;
    const margin = 20;
    const max_offset = 20;
    const layer_gap = self.overview.layer_gap;
    for (let i = 0; i < max_depth; ++i) {
        const nodes_i = nodes.filter(d => d.depth == i).sort((a, b) => {
        let asrc = edges.find(d => d.target == a);
        asrc = asrc && asrc.source;
        let bsrc = edges.find(d => d.target == b);
        bsrc = bsrc && bsrc.source;
        return (asrc && asrc.x) - (bsrc && bsrc.x);
        });
        const n = nodes_i.length;

        let x1 = 0;
        nodes_i.forEach((d, j) => {
        d.x = x1;
        x1 += d.width;
        });
        nodes_i.forEach(d => {
        d.x = self.overview.padding + width / 2 + d.x - x1 / 2;
        d.y = y1;
        });
        nodes_i.forEach((d, j) => {
        const from = edges.find(e => e.target == d);
        if (!from) return;
        const parent = edges.find(e => e.target == d).source;
        if (
            parent.x + max_offset < d.x &&
            (j == 0 ||
            parent.x > nodes_i[j - 1].x + nodes_i[j - 1].width + margin)
        ) {
            const delta = d.x - parent.x;
            for (var k = j; k < nodes_i.length; ++k) {
            nodes_i[k].x -= delta;
            }
        }
        });
        const max_degree = Math.max(...nodes_i.map(d => d.degree)) || 1;
        y1 += Math.max(...nodes_i.map(d => d.height));
        if (i != max_depth - 1) {
        y1 += layer_gap * max_degree;
        }
    }

    nodes.forEach(d => {
        // d.y = self.overview.padding + height / 2 + d.y - y1 / 2;
        d.background = [];
        for (let i = 0; i < d.data.length; ++i) {
        const t = d.data[i];
        const shorter_than_prev = i && t.width < d.data[i - 1].width;
        d.background.push({
            x0: t.x - 5,
            x1: t.x + t.width + 5,
            y: t.y + (shorter_than_prev ? 5 : -5)
        });
        const shorter_than_next =
            i + 1 < d.data.length && t.width < d.data[i + 1].width;
        d.background.push({
            x0: t.x - 5,
            x1: t.x + t.width + 5,
            y: t.y + t.height + (shorter_than_next ? -5 : 5)
        });
        }
        d.type = d.data[0].type;
        d.top = d.background[0];
        d.bottom = d.background[d.background.length - 1];
    });
    console.log(nodes, edges);
    return {
        nodes,
        edges,
    };
}