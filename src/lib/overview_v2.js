import * as Slide from "./SlideTemplate";
import textwidth from "./text-width";
import { color_schema } from "./colors";
import * as d3 from "d3";

export function paintOverview(self) {
    const graph = self.overview_graph;
    const svg = self.overview.svg;
    svg.selectAll("*").remove();

    const g = svg
        .append("g")
        .attr("class", "view")
        .attr(
            "transform",
            `translate(${self.overview.padding},${self.overview.padding})`
        );
        
    var tree = d3.tree()
        .size([600, 400]);
    const root = self.overview_graph.root;
    tree(root);

    var link = g.selectAll(".link")
        .data(root.descendants().slice(1))
      .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);
  
    var node = g.selectAll(".node")
        .data(root.descendants())
      .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
    const padding = 25;
    const text_dx = 25;
    const text_dy = 14;
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
            return "lightgray";
        }
    };

    const color_scale = d => get_color_schema(d.data.type)[0];

    node
        .append("rect")
        .attr("width", d => (
            padding +
            2 * self.overview.textpadding_left_right +
            textwidth(d.data.abbrname, {
                family: self.overview.fontfamily,
                size: self.overview.fontsize
            })
        ))
        .attr("height", d => self.overview.fontsize + 2 * self.overview.textpadding_top_bottom)
        .attr("rx", 5)
        .attr("ry", 5)
        .style("fill", d => color_scale(d))
        .style("fill-opacity", d => (d.data ? 0.5 : 1));

    node
        .append("circle")
        .attr("cx", 10)
        .attr("cy", d => 10)
        .attr("r", 5)
        .style("fill", "white")
        .style("fill-opacity", d => (d.data ? 0.3 : 1));

    node
        .append("text")
        .text(d => d.data.abbrname)
        .attr("dx", d => padding)
        .attr("dy", d => 12)
        .style("font-size", "12px")
        .style("font-family", "Arial")
        .style("fill", d => (d.data ? '#bbb' : '#fff'));

    function diagonal(d) {
        return "M" + d.y + "," + d.x
            + "C" + (d.parent.y + 100) + "," + d.x
            + " " + (d.parent.y + 100) + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
    }
}

export function get_overview_graph(self) {
    let Q = [], P = [];

    const vnode = (id, r = self.current_chapter.id) => ({
        name: Slide.questions[id],
        abbrname: Slide.abbr_questions[id],
        type: Slide.relation.grouptype[Slide.relation.groupIdOf(id)],
        id: id,
        index: '',
        data: null,
        parent: null,
        resource_id: r,
    });

    const rnode = (n) => ({
        name: n.name,
        abbrname: n.abbrname,
        type: n.type,
        id: n.id,
        index: '',
        data: n,
        parent: null,
        resource_id: n.resource_id,
    });

    let x;
    let head = 0, tail = 0;
    const visited = new Set();

    if (self.page.find(d => d.id == 'O1')) {
        x = rnode(self.page.find(d => d.id == 'O1'));
    } else {
        x = vnode('O1');
    }
    x.parent = self.current_chapter.id;
    Q.push(x); tail++;
    visited.add(x.id + x.resource_id);

    if (self.page.find(d => d.id == 'S1')) {
        x = rnode(self.page.find(d => d.id == 'S1'));
    } else {
        x = vnode('S1');
    }
    x.parent = self.current_chapter.id;
    Q.push(x); tail++;
    visited.add(x.id + x.resource_id);
    const group_visited = new Set();

    while (head < tail) {
        const u = Q[head];
        u.index = '' + head++;
        const gid = Slide.relation.groupIdOf(u.id);
        const group = Slide.relation.groups[gid];
        if (!group_visited.has(gid + u.resource_id)) {
            group_visited.add(gid + u.resource_id);
            P.push({
                parent: u.parent,
                abbrname: u.type,
                type: u.type,
                index: gid + u.resource_id,
            });
            u.parent = gid + u.resource_id;
        }
        for (const id of group) if (!visited.has(id + u.resource_id)) {
            const v = self.page.find(d => d.id == id && d.resource_id == u.resource_id);
            const element = v ? rnode(v) : vnode(id, u.resource_id);
            element.parent = gid + u.resource_id;
            Q.push(element); tail++;
            visited.add(id + u.resource_id);
        }
        if (head > 2 && !u.data) continue;

        Slide.relation.edges.filter(e => e.source == gid).forEach(e => {
            const target_group = Slide.relation.groups[e.target];
            if (Slide.scopeOf(target_group[0]) == Slide.scopeOf(u.id)) {
                const v = self.page.find(d => target_group.includes(d.id) && d.resource_id == u.resource_id);
                const target = v ? rnode(v) : vnode(target_group[0], u.resource_id);
                if (!visited.has(target.id + target.resource_id)) {
                    target.parent = gid + u.resource_id;
                    Q.push(target);  tail++;
                    visited.add(target.id + target.resource_id)
                }
            }

            self.page.filter(d => target_group.includes(d.id) && d.resource_id != u.resource_id).forEach(d => {
                const target = rnode(d);
                if (!visited.has(target.id + target.resource_id)) {
                    target.parent = gid + u.resource_id;
                    Q.push(target);  tail++;
                    visited.add(target.id + target.resource_id);
                }
            });
        });
    }
    P.push({
        parent: null,
        abbrname: 'root',
        type: 'root',
        index: self.current_chapter.id,
    });
    const data = Q.concat(P);
    const stratify = d3.stratify()
        .id(d => d.index)
        .parentId(d => d.parent);
    const root = stratify(data);

    return {
        root,
    };
}