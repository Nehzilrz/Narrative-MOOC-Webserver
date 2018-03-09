<template>
    <b-link v-if="item" href="javascript:void(0);" @click="click">
        <span class="step" :style="style">
            {{ (item.type || 'U').slice(0, 1).toUpperCase() }}
        </span>
        {{ item.name }}
    </b-link>
</template>

<script>
    export default {
        data() {
            return {
            };
        },
        computed: {
            item() {
                return this.context.id2item[this.id];
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
                }
                if (this.item.type == 'video') {
                    style.background = this.context.video_color;
                } else if (this.item.type == 'assignment') {
                    style.background = this.context.assignment_color;
                } else if (this.item.type == 'chapter') {
                    style.background = this.context.color_schema[5];
                } else if (this.item.type == 'student') {
                    style.background = this.context.color_schema[7];
                } else {
                    style.background = 'lightgray';
                }
                return style;
            }
        },
        methods: {
            click() {
                if (this.item.type == 'video') {
                    context.selectVideo(this.item);
                } else if (this.item.type == 'assignment') {
                    context.selectAssignment(this.item);
                } else if (this.item.type == 'chapter') {
                    context.selectChapter(this.item);
                } else if (this.item.type == 'student') {
                    context.selectStudent(this.item);
                } else {
                }
            },
        },
        props: ["id", "context"],
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

</style>