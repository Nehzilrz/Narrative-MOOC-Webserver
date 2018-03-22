<template>
    <p class="styled nar" @click="click" 
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
    text-align: center;
}

p.nar.styled:hover {
    border-style: solid;
    border-width: 1.5px 1.5px 1.5px 1.5px;
    border-color: rgba(127, 127, 127, 0.5);
}

</style>