<template>
<div>
    <div class="b4w bh nm-block text">
        <b-alert show variant="info">
            <h6 class="alert-heading">{{ assignment.name }} </h6>
            <p ref="content">
            </p>
            <hr>
            <p>
                The weight of this assignment is {{ assignment.weight }}. 
                Assignment released on {{ assignment_release_date }}.
            </p>
        </b-alert>
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
        mounted() {
            if (this.item.resource_id == "i4x://HKUSTx/COMP102x/problem/67f04dce356846219650e2514958f048") {
                this.$refs.content.innerHTML = "<p>What is the result of each of the following expressions?<br /><br />Expression X:&#160;&#160;&#160;&#160;3 % 4 - 10 * 5<br />Expression Y:&#160;&#160;&#160;&#160;5 + 11 / 2 * 2.0<br />Expression Z:&#160;&#160;&#160;&#160;100 / 0\n</p>\n  ";
            } else {
                this.$refs.content.innerHTML = this.assignment.content;
            }
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
        },
    };
</script>

<style scope>
.subtitle {
    text-align: center;
}

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