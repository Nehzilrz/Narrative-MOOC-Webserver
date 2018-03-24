<template>
  <div class="slideshow-inner-container">
      <slot></slot>
      <slideshow v-for="item, index in page" :context="context" :item="item">
      </slideshow>
  </div>
</template>

<script>

import Slideshow from "./Slideshow/SlideshowDynamic.vue";
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
        /* this.$sr.reveal('.slideshow-content', {
        }, 2000);
        */
    }
  }
};
</script>

<style scope>
.slideshow-inner-container {
  left: 0px;
  top: 0px;
  height: 100%;
  width: 80vw;
  display: inline-flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 10vh;
}

.slideshow-page {
  position: relative;
  margin-top: 0.5vh;
  margin-bottom: 0.5vh;
  padding-top: 1vh;
  padding-bottom: 1vh;
}

.slideshow-content {
  width: 90%;
  left: 1vw;
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.slideshow-content.title {
  font-weight: 800;
  text-align: center;
}

.slideshow-content.title h1,
h2,
h3,
h4 {
  font-weight: 800;
}

.slideshow-content h5,h6 {
  font-weight: 600;
}


.slideshow-content {
  margin-left: 1vw;
  margin-right: 1vw;
  position: relative;
}

.mooc-content {
  transition: 0.2s;
  transition-timing-function: ease-in-out;
}

.slideshow-content.graph {
  perspective: 200px;
  background-attachment: fixed;
}

.slideshow-content.text {
  margin-left: 3vw;
}
</style>

