<template>
  <div class="slideshow-inner-container">
      <slot></slot>
      <slideshow v-for="item, index in page" :context="context" :item="item">
      </slideshow>
  </div>
</template>

<script>

import Slideshow from "./Slideshow.vue";
export default {
  data() {
    return {
    };
  },
  props: ["page", "context"],
  components: {
    Slideshow,
  },
  methods: {

  },
  watch: {
    page() {
        /* this.$sr.reveal('.slide', {
        }, 2000);
        */
    }
  }
};
</script>

<style scope>
.slideshow-inner-container {
  padding-left: 2em;
  padding-right: 1em;
  top: 0px;
  height: 100%;
  width: 100%;
  display: inline-flex;
  flex-direction: column;
  overflow-x: hidden;
  padding-bottom: 10vh;
}

.slideshow-inner-container::-webkit-scrollbar {
  width: 0px;
  height: 5px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

