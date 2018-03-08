
import * as d3 from "d3";

export function getBubbleChart(svg, data, width = 600, height = 600) {
    width = width || +svg.attr("width");
    height = height || +svg.attr("height");

    var format = d3.format(",d");
    const colorSchema = ['#c7e9c0','#a1d99b','#74c476','#31a354'];
    var color = d3.scaleOrdinal(colorSchema);

    svg.selectAll("*").remove();

    var pack = d3.pack()
        .radius(d => d.value + 30)
        .size([width, height])
        .padding(1.5);

    var root = d3.hierarchy({ children: data })
        .sum(function (d) { return d.value; })
        .each(function (d) {
            if (id = d.data.id) {
                var id, i = id.lastIndexOf(".");
                d.id = id;
                d.package = id.slice(0, i);
                d.class = id.slice(i + 1);
            }
        });

    var chart = svg.append("g");

    var node = chart.selectAll(".node")
        .data(pack(root).leaves())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("id", function (d) { return d.id; })
        .attr("r", function (d) { return d.r; })
        .style("fill", function (d) { return color(d.package); })
        .style("opacity", 0.8);

    node.append("clipPath")
        .attr("id", function (d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function (d) { return "#" + d.id; });

    node.append("text")
        .attr("clip-path", function (d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function (d) {
            var vec = d.data.name.split(' ');
            var ret = [];
            for (var i = 0; i < vec.length; ++i) {
                if (!ret.length || ret[ret.length - 1].length + vec[i].length > 20) {
                    ret.push(vec[i]);
                } else {
                    ret[ret.length - 1] = ret[ret.length - 1] + ' ' + vec[i];
                }
            }
            return ret;
        })
        .enter().append("tspan")
        .attr("x", d => -d.length * 2.5)
        .attr("y", function (d, i, nodes) { return 20 + (i - nodes.length / 2 - 0.5) * 20; })
        .attr("font-size", "12px")
        .text(function (d) { return d; });

    node.append("title")
        .text(function (d) { return d.id + "\n" + format(d.value); });

    return pack(root).leaves();
}