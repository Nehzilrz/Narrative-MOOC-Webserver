<template>
    <b-link :title="id" class="entity" v-if="item" @click="click">
        <span class="step" :style="style">
            {{ (item.type || 'U').slice(0, 1).toUpperCase() }}
        </span>
        {{ item.name }}
    </b-link>
</template>

<script>
    import { color_schema } from "../../lib/colors";

    export default {
        data() {
            return {
            };
        },
        computed: {
            item() {
                return this.$mapping[this.id];
            },
            style() {
                const style = {
                    'border-radius': '0.65em',
                    '-moz-border-radius': '0.65em',
                    '-webkit-border-radius': '0.65em',
                    'display': 'inline-block',
                    'color': '#ffffff',
                    'font-weight': 'bold',
                    'line-height': '1.3em',
                    'margin-right': '4px',
                    'text-align': 'center',
                    'width': '1.3em',
                };
                if (this.item.type == 'video') {
                    style.background = color_schema[1];
                } else if (this.item.type == 'assignment') {
                    style.background = color_schema[3];
                } else if (this.item.type == 'chapter') {
                    style.background = color_schema[5];
                } else if (this.item.type == 'student') {
                    style.background = color_schema[7];
                } else {
                    style.background = 'lightgray';
                }
                return style;
            }
        },
        methods: {
            click() {
                if (this.item.type == 'video') {
                    this.$bus.$emit('select_video', this.item, this.parent);
                } else if (this.item.type == 'assignment') {
                    this.$bus.$emit('select_assignment', this.item, this.parent);
                } else if (this.item.type == 'chapter') {
                    this.$bus.$emit('select_chapter', this.item, this.parent);
                } else if (this.item.type == 'student') {
                    this.$bus.$emit('select_student', this.item, this.parent);
                } else {
                }
            },
        },
        props: ["id", "parent"],
    };
</script>

<style scope>

span.step {
  border-radius: 0.65em;
  -moz-border-radius: 0.65em;
  -webkit-border-radius: 0.65em;
  display: inline-block;
  font-weight: bold;
  line-height: 1.3em;
  margin-right: 4px;
  text-align: center;
  width: 1.3em;
}
.entity {
    padding-left: .5rem;
    color: #0055b4;
}

.entity:hover {
    color: #003167;
}

</style>