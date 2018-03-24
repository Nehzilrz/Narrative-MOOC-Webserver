<template>
  <div class="textbox" v-if="this.text != null"
      draggable="true"
      ref = "textbox"
      @dragend="drag($event)"
      :style="{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }">
      <div class="bar">
        TextBox
        <span @click="text = null"> X </span>
      </div>
      <medium-editor class="textarea" :text='text' :options="options" @edit="edit">
      </medium-editor>
  </div>
</template>

<script>

export default {
  data() {
    return {
      text: this.value.text,
      position: this.value.position,
      options: {
        delay: 1000,
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "indent",
            "outdent",
            "h4",
            "h5",
            "h6",
          ],
          diffLeft: 25,
          diffTop: 10
        },
        anchor: {
          placeholderText: "Type a link",
          customClassOption: "btn",
          customClassOptionText: "Create Button"
        },
        paste: {
          cleanPastedHTML: true,
          cleanAttrs: ["style", "dir"],
          cleanTags: ["label", "meta"],
          unwrapTags: ["sub", "sup"]
        },
        anchorPreview: {
          hideDelay: 300
        },
        placeholder: false,
      }
    };
  },
  model: {
    prop: 'value',
  },
  props: ['value'],
  watch: {
    value(val) {
      this.text = val.text;
      this.position = val.position;
    },
    text(val) {
      this.$emit('input', {
        text: val, position: this.position
      });
    },
    position(val) {
      this.$emit('input', {
        text: this.text, position: val
      });
    }
  },
  methods: {
    edit(e) {
      this.text = e.api.origElements.innerHTML;
    },
    drag(e) {
      var textbox = this.$refs.textbox;
      var rect = textbox.parentElement.getBoundingClientRect();
      var diffX = rect.x + textbox.clientWidth / 2;
      var diffY = rect.y + 5;
      this.position.x = e.clientX - diffX;
      this.position.y = e.clientY - diffY;
    }
  }
};
</script>

<style scope>
.textbox {
  position: absolute;
  z-index: 2;
  border: solid;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0);
}
.textbox:hover {
  border-color: rgba(0, 0, 0, 0.5);
}

.textbox .bar {
  width: 100%;
  height: 20px;
  font-size: 14px;
  color: white;
  background: #777777;
  opacity: 0;
  position: relative;
}
.textbox .bar span {
  position: absolute;
  right: .1rem;
  top: .1rem;
  width: 1rem;
  height: 1rem;
  text-align: center;
  color: #777777;
  background: white;
}

.textbox .textarea {
  padding: .5rem;
}

.textbox:hover .bar {
  opacity: 1;
}
</style>
