<template>
    <p class="styled nar" @click="click" @mousemove="mousemove" @mouseout="mouseout"
    :style="{
        background: color
    }">
        <slot></slot>
    </p>
</template>

<script>
    export default {
        data() {
            return {
                color: 'rgba(0, 0, 0, 0)',
            };
        },
        computed: {
            style() {
                return style;
            }
        },
        methods: {
            mousemove() {
                if (!this.context.presentation_mode) return;
                const entities = this.$el.getElementsByClassName('entity');
                if (entities.length) {
                  const entity_id = entities[0].title;
                  this.current_element_id = entity_id;
                  this.$bus.$emit("refresh-chart", entity_id);
                }
            },
            mouseout() {
                if (!this.context.presentation_mode) return;
                this.$bus.$emit("refresh-chart", '');
            },
            click() {
                if (this.context.enable_highlight_text) {
                    this.color = 
                        this.context.current_color.includes('rgba') ?
                        this.context.current_color :
                        this.context.current_color
                        .replace('rgb', 'rgba')
                        .replace(')', ',0.5)');
                }
            },
        },
        props: ["context"],
    };
</script>

<style scope>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400');

p.nar.styled {
    border-style: solid;
    border-width: 1.5px 1.5px 1.5px 1.5px;
    border-radius: 5px;
    display: inline-block;
    padding-top: .2rem;
    padding-bottom: .2rem;
    margin-top: .2rem;
    margin-bottom: .2rem;
    border-color: rgba(127, 127, 127, 0.0);
    font-family: 'Source Sans Pro', sans-serif;
    -webkit-font-smoothing: antialiased;
    font-size: 22px;
    font-weight: normal;    
    color: #2c3e50;
}

p.nar.styled:hover {
    border-style: solid;
    border-width: 1.5px 1.5px 1.5px 1.5px;
    border-color: rgba(127, 127, 127, 0.5);
}

</style>