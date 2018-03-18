<template>
  <div class="shapebox" v-if="this.shape != null"
      draggable="true"
      ref = "shapebox"
      @dragend="drag($event)"
      :style="{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }">
      <div class="bar">
        shapebox
        <span @click="shape = null"> X </span>
      </div>
      <div class="shape" ref="shape">
      </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      shape: this.value.shape,
      position: this.value.position,
    };
  },
  model: {
    prop: 'value',
  },
  mounted() {
      this.$refs.shape.innerHTML = this.shape;
  },
  props: ['value'],
  watch: {
    value(val) {
      this.shape = val.shape;
      this.position = val.position;
    },
    position(val) {
      this.$emit('input', {
        shape: this.shape, position: val
      });
    }
  },
  methods: {
    drag(e) {
      var shapebox = this.$refs.shapebox;
      var rect = shapebox.parentElement.getBoundingClientRect();
      var diffX = rect.x + shapebox.clientWidth / 2;
      var diffY = rect.y + 5;
      this.position.x = e.clientX - diffX;
      this.position.y = e.clientY - diffY;
    }
  }
};
</script>

<style scope>
.shapebox {
  position: absolute;
  z-index: 30;
  border: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0);
}
.shapebox:hover {
  border-color: rgba(0, 0, 0, 0.5);
}

.shapebox span {
  position: absolute;
  right: .1rem;
  top: .1rem;
  width: 1rem;
  height: 1rem;
  text-align: center;
  color: #777777;
  background: white;
}

</style>
