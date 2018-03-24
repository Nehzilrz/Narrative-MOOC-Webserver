<template>
  <div class="slideshow-inner-container">
      <slot></slot>
      <slideshow v-for="item, index in page" :context="context" :item="item">
      </slideshow>
  </div>
</template>

<script>

import Slideshow from "./Slideshows/Slideshow.vue";
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
  top: 0px;
  height: 100%;
  width: 78vw;
  display: inline-flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 10vh;
}
</style>

